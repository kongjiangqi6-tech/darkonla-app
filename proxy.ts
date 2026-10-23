import { clerkMiddleware } from "@clerk/nextjs/server";

// 导出名称从默认导出或 middleware 改为 proxy
export const proxy = clerkMiddleware();

export default proxy;

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};