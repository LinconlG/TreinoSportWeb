#!/bin/bash

# Exemplo de uso: ./changelog.sh 2025-07-01
DATA_INICIO="$1"

ARQUIVO="changelog.txt"
> "$ARQUIVO"

declare -A GRUPOS=(
  [feat]="### 🔧 Novas implementações"
  [fix]="### 🐛 Correções"
  [style]="### 🎨 Estilo e formatação"
  [refactor]="### ♻️ Refatorações"
  [ci]="### 🔁 Integração contínua"
  [chore]="### 🧹 Tarefas administrativas"
  [revert]="### ← Reversões"
  [outros]="### 📦 Outros commits"
)

declare -A AGRUPADOS           # AGRUPADOS["task|grupo"]
declare -A TASK_DESCRICAO      # TASK_DESCRICAO["task"] = "📝 Task #123" ou "📝 Sem task atribuída"

COMMITS=$(git log --since="$DATA_INICIO 00:00:00" \
  --pretty=format:"%h%x1f%s%x1f%b%x1f%an%x1f%ad%x1e" \
  --date=short)

while IFS=$'\x1f' read -r -d $'\x1e' HASH TITULO CORPO AUTOR DATA; do
  if [[ -z "$HASH" || -z "$TITULO" ]]; then
    continue
  fi

  HASH=${HASH//$'\n'/}

  PREFIX=$(echo "$TITULO" | grep -oE '^[a-z]+' | head -1)
  if [[ -z "$PREFIX" || -z "${GRUPOS[$PREFIX]}" ]]; then
    PREFIX="outros"
  fi

  # Captura a task #123 no título ou corpo
  if [[ "$TITULO" =~ \#([0-9]+) ]]; then
    TASK_ID="${BASH_REMATCH[1]}"
  else
    TASK_ID="sem-task"
  fi

  # Remove todas as ocorrências de #123 do título e corpo
  TITULO=$(echo "$TITULO" | sed -E 's/\(?#[0-9]+\)?//g' | sed -E 's/ +/ /g' | sed -E 's/^ //;s/ $//')


  CHAVE="${TASK_ID}|${PREFIX}"
  AGRUPADOS["$CHAVE"]+="$DATA - $AUTOR - $TITULO [$HASH]"$'\n'"$CORPO"$'\n\n'

  if [[ "$TASK_ID" == "sem-task" ]]; then
    TASK_DESCRICAO["$TASK_ID"]=">\n## 📝 Sem task atribuída"
  else
    TASK_DESCRICAO["$TASK_ID"]=">\n## 📝 Task #$TASK_ID\n============================================="
  fi
done <<< "$COMMITS"

# Imprime todas as tasks com ID
for TASK in "${!TASK_DESCRICAO[@]}"; do
  if [[ "$TASK" != "sem-task" ]]; then
    echo -e "${TASK_DESCRICAO[$TASK]}" >> "$ARQUIVO"
    echo >> "$ARQUIVO"

    for GRUPO in "${!GRUPOS[@]}"; do
      CHAVE="${TASK}|${GRUPO}"
      if [[ -n "${AGRUPADOS[$CHAVE]}" ]]; then
        echo -e "${GRUPOS[$GRUPO]}" >> "$ARQUIVO"
        echo -e "----------------------------" >> "$ARQUIVO"
        printf '%b\n' "${AGRUPADOS[$CHAVE]}" >> "$ARQUIVO"
      fi
    done

    echo "=============================================" >> "$ARQUIVO"
    echo >> "$ARQUIVO"
  fi
done

# Task sem ID (sem-task) no fim
if [[ -n "${TASK_DESCRICAO["sem-task"]}" ]]; then
  TASK="sem-task"
  echo -e "${TASK_DESCRICAO[$TASK]}" >> "$ARQUIVO"
  echo >> "$ARQUIVO"

  for GRUPO in "${!GRUPOS[@]}"; do
    CHAVE="${TASK}|${GRUPO}"
    if [[ -n "${AGRUPADOS[$CHAVE]}" ]]; then
      echo -e "${GRUPOS[$GRUPO]}" >> "$ARQUIVO"
      echo -e "----------------------------" >> "$ARQUIVO"
      printf '%b\n' "${AGRUPADOS[$CHAVE]}" >> "$ARQUIVO"
    fi
  done

  echo "=============================================" >> "$ARQUIVO"
  echo >> "$ARQUIVO"
fi

echo "✅ Commits agrupados salvos em '$ARQUIVO'"
