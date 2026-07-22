import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getAuthUser } from "../lib/api";

const useAuthUser = () => {
  const authUserQuery = useQuery({
    queryKey: ["authUser"],
    queryFn: getAuthUser,
    retry: false, // auth check
  });

  const authUser = useMemo(() => {
    const user = authUserQuery.data?.user;
    if (!user) return null;

    return {
      ...user,
      profilePic:
        user.profilePic ||
        user.profilePic ||
        `https://api.dicebear.com/6.x/initials/svg?seed=${encodeURIComponent(
          user.fullname || "user"
        )}`,
    };
  }, [authUserQuery.data]);

  return { isLoading: authUserQuery.isLoading, authUser };
};
export default useAuthUser;
