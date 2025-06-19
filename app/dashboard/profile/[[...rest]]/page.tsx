import { UserProfile } from "@clerk/nextjs";

export default function ProfilePage() {
  return (
    <div className="bg-white border-b">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your account information and settings
        </p>
      </div>

      <div className="mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="w-full mx-auto">
          <UserProfile
            appearance={{
              elements: {
                rootBox: "mx-auto",
                card: "shadow-none",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
