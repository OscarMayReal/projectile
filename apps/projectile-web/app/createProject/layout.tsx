export const metadata = {
  title: "Create Project - Projectile",
};

export default function CreateProjectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="w-[100vw] h-[100dvh] bg-[#fafafa] fixed top-0 left-0 right-0 bottom-0 flex flex-row items-center">
      {children}
    </div>
  );
}