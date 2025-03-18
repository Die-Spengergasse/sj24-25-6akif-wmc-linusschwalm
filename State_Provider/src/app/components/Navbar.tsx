'use client'  // Da wir usePathname vom Router verwenden.

import styles from './Navbar.module.css';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTodoAppState } from '@/app/context/TodoAppContext'
import NameInput from './NameInput';

export default function Navbar() {
    const { activeUser, actions } = useTodoAppState();

    const handleLogout = () => {
        actions.setActiveUser("");
    }

    const pathname = usePathname(); // Aktuellen Pfad abrufen
    return (
        <nav className={styles.nav}>
            <Link
                href="/"
                className={pathname === '/' ? styles.active : ''}
            >
                Home
            </Link>
            <Link
                href="/categories"
                className={pathname === '/categories' ? styles.active : ''}
            >
                Categories
            </Link>
            <Link
                href="/todos"
                className={pathname === '/todos' ? styles.active : ''}
            >
                Todos
            </Link>
            <Link
                href="/about"
                className={pathname === '/about' ? styles.active : ''}
            >
                About
            </Link>
            <div>
                {activeUser === "" ? (
                    <NameInput />
                ) : (
                    <>
                        <span>Welcome, {activeUser}</span>
                        <button onClick={handleLogout}>Logout</button>
                    </>
                )}
            </div>
        </nav>
    );
}
