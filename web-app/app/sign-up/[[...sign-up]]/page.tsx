import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return (
  <main className='bg-black h-screen flex flex-row justify-center items-center'>  
    <SignUp />
  </main>
  )
}