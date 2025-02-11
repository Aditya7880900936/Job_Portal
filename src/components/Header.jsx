import React, { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "./ui/button";
import { SignedIn, SignedOut, UserButton, SignIn, useUser } from "@clerk/clerk-react";
import { BriefcaseBusiness, Heart, PenBox } from "lucide-react";
import { useState } from "react";

const Header = () => {
  const [showSignIn, setShowSignIn] = useState(false);
  const { user } = useUser()
  const [search, setSearch] = useSearchParams();

  useEffect(() => {
    if (search.get("sign-in") === "true") {
      setShowSignIn(true);
    }
  }, [search]);

  const handleOverlayClick = (evt) => {
    if (evt.target === evt.currentTarget) {
      setShowSignIn((prev) => !prev);
      setSearch({});
    }
  };

  return (
    <>
      <nav className="py-4 flex justify-between items-center">
        <Link>
          <img src="/logo.png" className="h-20 " alt="logo" />
        </Link>

        <div className="flex gap-8">
          <SignedOut>
            <Button
              variant="outline"
              onClick={() => setShowSignIn((prev) => !prev)}
            >
              Login
            </Button>
          </SignedOut>
          <SignedIn>
            { user?.unsafeMetadata?.role === "Recruiter" &&(
              <Link to="/post-Job">
                <Button className="rounded-full" variant="destructive">
                  <PenBox size={20} className="mr-2" />
                  Post A Job
                </Button>
              </Link>
            )}
            <UserButton
              appearance={{
                element: {
                  avatarBox: "w-16 h-16",
                },
              }}
            >
              <UserButton.MenuItems>
                <UserButton.Link
                  label="My Jobs"
                  labelIcon={<BriefcaseBusiness size={15} />}
                  href="/myJobs"
                />
                <UserButton.Link
                  label="Saved Jobs"
                  labelIcon={<Heart size={15} />}
                  href="/savedJobs"
                />
              </UserButton.MenuItems>
            </UserButton>
          </SignedIn>
        </div>
      </nav>

      {showSignIn && (
        <div
          className="fixed inset-0 bg-black/50 flex items-center justify-center"
          onClick={handleOverlayClick}
        >
          <SignIn
            signUpForceRedirectUrl="/onboarding"
            fallbackRedirectUrl="/onboarding"
          />
        </div>
      )}
    </>
  );
};

export default Header;
