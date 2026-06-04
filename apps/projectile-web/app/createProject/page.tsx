"use client";

import { Item, ItemGroup, ItemHeader, ItemTitle, ItemDescription, ItemContent, ItemActions, ItemFooter } from "@/components/ui/item";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { PlusCircleIcon, PlusIcon, XIcon } from "lucide-react";
import { useCreateProject } from "@projectile/shared";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CreateProjectPage() {
  const [projectName, setProjectName] = useState("New Project");
  const { createProject: submitProject, creating, error } = useCreateProject({});
  const router = useRouter();
  return (
    <>
      <div className="flex w-[50%]">
        <div className="flex flex-col w-xl justify-center h-full mx-auto">
          {/* <PlusCircleIcon className="mb-2" size={30} /> */}
          <h1 className="text-2xl font-medium">Create Project</h1>
          <ItemGroup className="mt-5 w-full bg-white rounded-lg border-1">
            <Item>
              <ItemContent>
                <ItemTitle>Project Name</ItemTitle>
                <ItemDescription>Enter a name for your project</ItemDescription>
              </ItemContent>
              <ItemFooter>
                <Input placeholder="Project Name" value={projectName} onChange={(e) => setProjectName(e.target.value)} />
              </ItemFooter>
            </Item>
          </ItemGroup>
          <div className="flex flex-row gap-2 mt-5">
            <Button disabled={creating} onClick={() => {
              creating ? null : submitProject({ name: projectName }).then(() => {
                router.push("/app");
              });
            }}><PlusIcon />{creating ? "Creating..." : "Create"}</Button>
            <Button variant="outline"><XIcon />Cancel</Button>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-[50%] border-l-1 border-gray-200 h-full items-center justify-center bg-white">
        <div className="flex flex-col">
          <img src="/assets/logo.svg" alt="Projectile Logo" className="w-10 h-10 mb-3" />
          <h2 className="text-xl font-medium">Get Started with Projectile</h2>
          <ul className="mt-2 list-disc ml-4">
            <li className="font-medium">Create Boards</li>
            <p className="text-sm text-neutral-500">Organize your work with customizable boards</p>
            <li className="font-medium">Manage Bugs</li>
            <p className="text-sm text-neutral-500">Track and resolve issues efficiently</p>
            <li className="font-medium">Inform users</li>
            <p className="text-sm text-neutral-500">Keep your users updated with changelogs</p>
          </ul>
        </div>
      </div>
    </>
  );
}
