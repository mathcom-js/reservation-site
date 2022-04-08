import { User } from "@prisma/client";
import { useState } from "react";

export default function Users() {
  const [users, setUsers] = useState<User[]>();
  const onClick = async () => {
    const res = await fetch("/api/users");
    const json = await res.json();
    setUsers(json.data.users);
  };
  return (
    <div className="flex flex-col space-y-4 items-center">
      <button onClick={onClick}>Fetch</button>
      {users?.map((user) => (
        <div className="grid grid-cols-3 space-x-8" key={user.id}>
          <span>{user.username}</span>
          <span>{user.avatar}</span>
          <span>{new Date(user.createdAt).toLocaleDateString()}</span>
        </div>
      ))}
    </div>
  );
}
