import { Link } from '@remix-run/react';

export function Footer() {
    return (
        <footer className="mt-auto bg-gray-100 py-6">
            <div className="container mx-auto px-4 text-center text-gray-600">
                <p>&copy; 2023 CampusConnect. All rights reserved.</p>
                <p className="mt-2">
                    <Link
                        to="/privacy-policy"
                        className="text-blue-600 hover:underline"
                    >
                        Privacy Policy
                    </Link>
                </p>
            </div>
        </footer>
    );
}
