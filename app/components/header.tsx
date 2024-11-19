import { Link } from '@remix-run/react';

interface HeaderProps {
    firstName?: string | undefined | null;
    imageUrl?: string | undefined | null;
}

export function Header({ firstName = '', imageUrl = '' }: HeaderProps) {
    return (
        <header className="bg-blue-600 py-4 sm:py-6">
            <div className="container mx-auto px-4">
                <div className="flex flex-row items-center justify-between">
                    <div className="flex items-center">
                        <Link to="/" className="pr-1">
                            <img
                                alt="Company Logo"
                                src="/images/logo.png"
                                className="h-6 w-auto md:h-12"
                            />
                        </Link>
                        <h1 className="text-xl text-white">CampusConnect</h1>
                    </div>
                    {firstName ? (
                        <div className="flex items-center space-x-4">
                            <Link to="/home">
                                <img
                                    src={
                                        imageUrl
                                            ? imageUrl
                                            : 'https://ui-avatars.com/api/?name=' +
                                              firstName
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
