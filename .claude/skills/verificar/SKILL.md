---
name: verificar
description: Checklist de verificação que o orquestrador aplica antes de aceitar o trabalho do executor. Use ao conferir qualquer entrega.
---

# Verificar uma entrega

1. Leia o diff real (`git diff`), não o resumo do executor.
2. O critério de aceite da tarefa foi cumprido? Teste de forma objetiva (comando, build, teste, abrir o arquivo).
3. Algo fora do escopo foi alterado? Se sim, reverta ou devolva.
4. Arquivos grandes (imagens/vídeos) não foram modificados nem duplicados sem pedido.
5. Resultado: **aprovado**, ou **reprovado** com o erro exato e a correção esperada para devolver ao executor.
