export default function SoNosso() {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-6 px-6 text-center">
      <h1 className="font-serif text-6xl font-semibold text-vinho">Lane</h1>
      <p className="max-w-sm font-serif text-2xl italic">Este lugar é só da Lane e do Wesley.</p>
      <p className="max-w-sm text-sm text-suave">Se você é um dos dois, entre com a conta Google certa.</p>
      <form action="/auth/sair" method="post">
        <button className="botao-leve">Trocar de conta</button>
      </form>
    </main>
  );
}
