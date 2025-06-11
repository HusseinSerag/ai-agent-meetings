"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
export default function Home() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { data, isPending, refetch } = authClient.useSession();

  function createUser() {
    authClient.signUp.email(
      {
        email,
        password,
        name,
        callbackURL: "/dashboard",
      },
      {
        onRequest(ctx) {},
        onSuccess(ctx) {
          alert("success");
        },
        onError(ctx) {
          alert(ctx.error.message);
        },
      }
    );
  }
  return (
    <div className="p-4">
      {isPending ? (
        <div>Loading</div>
      ) : (
        <div>
          {!data ? (
            <Button onClick={() => refetch()}>try refetching</Button>
          ) : (
            <div>Welcome {data.user.name}</div>
          )}
        </div>
      )}
      <Label className="flex flex-col items-start max-w-1/2">
        <h1>Name</h1>
        <Input
          placeholder="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        ></Input>
      </Label>
      <Label className="flex flex-col items-start max-w-1/2">
        <h1>password</h1>
        <Input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        ></Input>
      </Label>
      <Label className="flex flex-col items-start max-w-1/2">
        <h1>email</h1>
        <Input value={email} onChange={(e) => setEmail(e.target.value)}></Input>
      </Label>

      <Button onClick={() => createUser()}>create user</Button>
      {data && data.session && (
        <Button onClick={() => authClient.signOut()}>Sign out</Button>
      )}
    </div>
  );
}
