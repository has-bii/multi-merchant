import { Button } from "@/components/ui/button"
import { authClient } from "@/lib/auth-client"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/")({ component: Home })

function Home() {
  const { data: session, isPending, refetch } = authClient.useSession()

  const logoutHandler = async () => {
    await authClient.signOut()
    await refetch()
  }

  return (
    <div className="p-8">
      <h1 className="text-4xl font-bold">Welcome to TanStack Start</h1>
      <p className="mt-4 text-lg">
        Edit <code>src/routes/index.tsx</code> to get started.
      </p>
      {isPending && <p>Loading...</p>}
      {session && <p>You are logged in as {session.user.name}</p>}
      {session && <Button onClick={logoutHandler}>Logout</Button>}
    </div>
  )
}
