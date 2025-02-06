import Image from "next/image";
import { ReactNode } from "react";

interface BackgroundWrapperProps {
  children: ReactNode;
}

const BackgroundWrapper = ({ children }: BackgroundWrapperProps) => {
  return (
    <div className="relative w-full min-h-screen">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/background/3.jpg"
          alt="Background"
          fill
          className="object-cover"
          priority
        />
      </div>
      <div className="relative">{children}</div>
    </div>
  );
};

export default BackgroundWrapper;
