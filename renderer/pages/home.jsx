import React , {useState , useEffect} from 'react'
import Head from 'next/head'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter } from 'next/router'

export default function HomePage() {
  const [message, setMessage] = useState('No message found');
  const router = useRouter();


 useEffect(() => {
    window.ipc.on('message', (message) => {
      setMessage(message)
    })
  }, [])

  const routerHandler =  () => {
    router.push("/test")
  };

  return (
    <React.Fragment>
      <Head>
        <title>Home - Nextron (basic-lang-javascript)</title>
      </Head>
      <div>
        <p>
          ⚡ Electron + Next.js ⚡ - <Link href="/next">Go to next page</Link>
        </p>
        <Image
          src="/images/logo.png"
          alt="Logo image"
          width={256}
          height={256}
        />
      </div>
      <div>
        <button
        className='w-full rounded-md bg-yellow-500 py-2 lg:py-3 px-4 text-base font-semibold text-white shadow hover:bg-yellow-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2'
          onClick={() => {
            window.ipc.send('message', 'Hello')
          }}
        >
          Test IPC
        </button>
        <button
          onClick={routerHandler}
        >
          Test router
        </button>
        <Link className='text-red-500 mx-4' href="/test">test Link navigation</Link>
        <p>{message}</p>

        <Link className='text-yellow-500 mx-4' href="/employees">employees</Link>
      </div>
    </React.Fragment>
  )
}
