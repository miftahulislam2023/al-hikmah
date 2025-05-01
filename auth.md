# Credentials Provider

To use the Credentials Provider, you'll first need to import and configure it in your Auth.js setup. This provider allows you to implement custom login logic based on form input values.

Here's how to set it up:

1. Import the provider.
2. Add it to the providers array in your Auth.js config.
3. Define the credentials and authorize fields.

## credentials

The credentials object defines the input fields displayed on the default sign-in page. These inputs are automatically rendered on the route:

- `/api/auth/signin` (Next.js)
- `/auth/signin` (Other frameworks)

Each field accepts the following properties:

- **label**: Input label
- **type**: HTML input type (text, password, etc.)
- **placeholder**: Placeholder text

These fields are also passed to the authorize function under the credentials argument.

For more details, see the Built-in Pages guide.

```javascript
Credentials({
  credentials: {
    email: {
      type: "email",
      label: "Email",
      placeholder: "johndoe@gmail.com",
    },
    password: {
      type: "password",
      label: "Password",
      placeholder: "*****",
    },
  },
})
```

## authorize

The authorize function handles the custom login logic and determines whether the credentials provided are valid.

It receives the input values defined in credentials, and you must return either a user object or null. If null is returned, the login fails.

### ./auth.ts

```javascript
import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
// Your own logic for dealing with plaintext password strings; be careful!
import { saltAndHashPassword } from "@/utils/password"
 
export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        // logic to salt and hash password
        const pwHash = saltAndHashPassword(credentials.password)
 
        // logic to verify if the user exists
        user = await getUserFromDb(credentials.email, pwHash)
 
        if (!user) {
          // No user found, so this is their first attempt to login
          // Optionally, this is also the place you could do a user registration
          throw new Error("Invalid credentials.")
        }
 
        // return user object with their profile data
        return user
      },
    }),
  ],
})
```

If you're using TypeScript, you can augment the User interface to match the response of your authorize callback, so whenever you read the user in other callbacks (like the jwt) the type will match correctly.

## Signin Form

Finally, let's create a simple sign-in form.

### ./components/sign-in.tsx

```javascript
import { signIn } from "@/auth"
 
export function SignIn() {
  return (
    <form
      action={async (formData) => {
        "use server"
        await signIn("credentials", formData)
      }}
    >
      <label>
        Email
        <input name="email" type="email" />
      </label>
      <label>
        Password
        <input name="password" type="password" />
      </label>
      <button>Sign In</button>
    </form>
  )
}
```

## Validating credentials

Always validate the credentials server-side, i.e. by leveraging a schema validation library like Zod.

```bash
npm install zod
```

Next, we'll set up the schema and parsing in our auth.ts configuration file, using the authorize callback on the Credentials provider.

### ./lib/zod.ts

```javascript
import { object, string } from "zod"
 
export const signInSchema = object({
  email: string({ required_error: "Email is required" })
    .min(1, "Email is required")
    .email("Invalid email"),
  password: string({ required_error: "Password is required" })
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
})
```

### ./auth.ts 2

```javascript
import NextAuth from "next-auth"
import { ZodError } from "zod"
import Credentials from "next-auth/providers/credentials"
import { signInSchema } from "./lib/zod"
// Your own logic for dealing with plaintext password strings; be careful!
import { saltAndHashPassword } from "@/utils/password"
import { getUserFromDb } from "@/utils/db"
 
export const { handlers, auth } = NextAuth({
  providers: [
    Credentials({
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        try {
          let user = null
 
          const { email, password } = await signInSchema.parseAsync(credentials)
 
          // logic to salt and hash password
          const pwHash = saltAndHashPassword(password)
 
          // logic to verify if the user exists
          user = await getUserFromDb(email, pwHash)
 
          if (!user) {
            throw new Error("Invalid credentials.")
          }
 
          // return JSON object with the user data
          return user
        } catch (error) {
          if (error instanceof ZodError) {
            // Return `null` to indicate that the credentials are invalid
            return null
          }
        }
      },
    }),
  ],
})
```

When authorize returns null, Auth.js handles the error in one of two ways:

1. **Using built-in pages:**
   - The user is redirected to the login page with the query string: `?error=CredentialsSignin&code=credentials`. You can customize the code using the credentials provider options.

2. **Using form actions or custom error handling** (e.g., in Remix, SvelteKit):
   - The error is thrown as `credentialssignin` and must be caught manually in your server action. See more in the Auth.js error reference.
