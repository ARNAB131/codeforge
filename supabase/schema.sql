07:45:12.813 Running build in Washington, D.C., USA (East) – iad1
07:45:12.814 Build machine configuration: 2 cores, 8 GB
07:45:13.064 Cloning github.com/ARNAB131/codeforge (Branch: main, Commit: 0f27954)
07:45:13.066 Previous build caches not available.
07:45:13.412 Cloning completed: 347.000ms
07:45:13.843 Running "vercel build"
07:45:13.869 Vercel CLI 55.0.0
07:45:14.301 Installing dependencies...
07:45:53.071 
07:45:53.072 added 434 packages in 39s
07:45:53.072 
07:45:53.073 208 packages are looking for funding
07:45:53.073   run `npm fund` for details
07:45:53.171 Detected Next.js version: 16.2.10
07:45:53.184 Running "npm run build"
07:45:53.343 
07:45:53.343 > codeforge@1.0.0 build
07:45:53.344 > next build
07:45:53.344 
07:45:54.114   Applying modifyConfig from Vercel
07:45:54.121 Attention: Next.js now collects completely anonymous telemetry regarding usage.
07:45:54.121 This information is used to shape Next.js' roadmap and prioritize features.
07:45:54.122 You can learn more, including how to opt-out if you'd not like to participate in this anonymous program, by visiting the following URL:
07:45:54.122 https://nextjs.org/telemetry
07:45:54.122 
07:45:54.146 ▲ Next.js 16.2.10 (Turbopack)
07:45:54.148 
07:45:54.151 ⚠ The "middleware" file convention is deprecated. Please use "proxy" instead. Learn more: https://nextjs.org/docs/messages/middleware-to-proxy
07:45:54.193   Creating an optimized production build ...
07:46:04.917 ✓ Compiled successfully in 10.3s
07:46:04.921   Running TypeScript ...
07:46:05.194 
07:46:05.195   We detected TypeScript in your project and reconfigured your tsconfig.json file for you.
07:46:05.195   The following suggested values were added to your tsconfig.json. These values can be changed to fit your project's needs:
07:46:05.196 
07:46:05.196   	- include was updated to add '.next/dev/types/**/*.ts'
07:46:05.196 
07:46:05.196   The following mandatory changes were made to your tsconfig.json:
07:46:05.197 
07:46:05.197   	- jsx was set to react-jsx (next.js uses the React automatic runtime)
07:46:05.197 
07:46:10.199 Failed to type check.
07:46:10.201 
07:46:10.201 ./app/dashboard/page.tsx:16:8
07:46:10.202 Type error: File '/vercel/path0/types/database.ts' is not a module.
07:46:10.202 
07:46:10.202   14 |   Profile,
07:46:10.203   15 |   Repository
07:46:10.203 > 16 | } from "@/types/database";
07:46:10.204      |        ^
07:46:10.204   17 |
07:46:10.204   18 | export default async function DashboardPage() {
07:46:10.205   19 |   const supabase = await createClient();
07:46:10.249 Next.js build worker exited with code: 1 and signal: null
07:46:10.307 Error: Command "npm run build" exited with 1
