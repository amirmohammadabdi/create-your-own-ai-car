import Link from "next/link";

export default function Header(){
    return(
        <header>
            <h1>Create Mind</h1>
            <ul>
                <li><Link href={'/'}>Home</Link></li>
                <li><Link href={'/pannel'}>Pannel</Link></li>
            </ul>
        </header>
    )
}