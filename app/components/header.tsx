import { Link } from '@remix-run/react';

interface HeaderProps {
    name?: string | undefined | null;
    imageUrl?: string | undefined | null;
}

export function Header({ name = '', imageUrl = '' }: HeaderProps) {
    return (
        <header className="bg-blue-600 py-4 sm:py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex">
                        <Link to="/" className="pr-2 pt-1">
                            <img
                                alt="Company Logo"
                                src="/images/logo.png"
                                className="h-6 w-auto md:h-12"
                            />
                        </Link>
                        <h1 className="text-2xl text-white sm:text-4xl md:text-3xl">
                            CampusConnect
                        </h1>
                    </div>
                    {name ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/home">
                                <img
                                    src={
                                        imageUrl
                                            ? imageUrl
                                            : 'https://ui-avatars.com/api/?name=' +
                                              name
                                    }
                                    alt=""
                                    className="h-8 w-8 rounded-full object-cover"
                                />
                            </Link>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 transition duration-300 hover:bg-blue-50 sm:text-base"
                        >
                            Log In
                        </Link>
                    )}
                </div>
            </div>
        </header>
    );
}
