# Backend Server Explanation (Node.js)

Since you are already familiar with **Node.js** and **Express**, this document will help you explain how the CodeBuddy server works compared to a traditional Express app.

## Is this using Node.js?
**Yes!** The entire backend of CodeBuddy runs on Node.js. 
When you run `npm run dev`, it starts a Node.js server to handle incoming requests, talk to MongoDB, and serve the frontend.

## Is it using Express?
**No, it uses something more modern.** 
In a traditional Node app, you would install `express`, manually set up the server with `app.listen(3000)`, and write routes like `app.get('/api/users', ...)`.

CodeBuddy uses a modern full-stack framework called **TanStack Start** (which runs on a powerful Node server engine called **Nitro**). It does the exact same job as Express, but it is highly automated. 

Here is how it compares to Express so you can explain it easily:

### 1. Starting the Server
- **Express**: You have to manually write `app.listen(5173, () => console.log("Server running"))`.
- **CodeBuddy**: The framework automatically spins up the Node server for us when we type `npm run dev` in the terminal. We don't have to write the boilerplate listening code.

### 2. Creating API Routes
- **Express**: You would create a route by writing:
  ```javascript
  app.get('/api/assets/:dayId/:filename', (req, res) => {
      const dayId = req.params.dayId;
      // fetch from database and res.send()
  });
  ```
- **CodeBuddy**: We use **File-Based Routing**. Instead of writing `app.get`, we simply create a file named `api.assets.$dayId.$filename.ts`. The server automatically turns that file into an API endpoint! 
  
  Inside that file, we still write standard request-handling logic just like Express, but we return a standard web `Response` object:
  ```javascript
  // Inside src/routes/api.assets.$dayId.$filename.ts
  export const Route = createFileRoute("/api/assets/$dayId/$filename")({
    server: {
      handlers: {
        GET: async ({ params }) => {
          const dayId = params.dayId;
          // fetch from database and return a Response!
        }
      }
    }
  });
  ```

### 3. Server Functions (RPC)
In Express, you normally build a REST API (like `/api/login`) and then have the frontend use `fetch('/api/login')` to talk to it.

In CodeBuddy, we use **Server Functions**. In our `src/lib/mongo.functions.ts` file, we have functions wrapped in `createServerFn`. 
When the frontend calls these functions, the framework automatically handles creating a secret, invisible API endpoint behind the scenes and fetching the data for us! 

It's essentially doing exactly what Express does, but it saves us from having to manually wire up hundreds of `fetch()` calls and `app.post()` endpoints.

## Summary for the Teacher
If your teacher asks about the backend, you can say:
> *"The backend runs entirely on Node.js. However, instead of writing manual boilerplate code using Express, I used a modern framework called TanStack Start that handles the server startup and uses File-Based API routing to connect my frontend to MongoDB."*
