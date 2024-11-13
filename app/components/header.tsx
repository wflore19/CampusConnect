import { Link } from '@remix-run/react';

interface HeaderProps {
    name?: string | undefined | null;
    imageUrl?: string | undefined | null;
}

export function Header({ name = '', imageUrl = '' }: HeaderProps) {
    return (
        <header className="bg-blue-600 py-4 sm:py-6">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between sm:flex-row">
                    <div className="mb-4 flex text-center sm:mb-0 sm:text-left">
                        <Link to="/" className="pr-2 pt-1">
                            <img
                                alt="Company Logo"
                                src="/images/logo.png"
                                className="h-12 w-auto"
                            />
                        </Link>
                        <div className="flex-col">
                            <h1 className="text-3xl font-bold text-white sm:text-4xl">
                                CampusConnect
                            </h1>
                            <p className="mt-1 text-lg text-white sm:mt-2 sm:text-xl">
                                Building Community on Campus
                            </p>
                        </div>
                    </div>
                    {name ? (
                        <div className="flex items-center space-x-4">
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
                            <Link
                                to="/home"
                                className="rounded bg-white px-4 py-2 text-sm font-bold text-blue-600 transition duration-300 hover:bg-blue-50 sm:text-base"
                            >
                                Go to Dashboard
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
