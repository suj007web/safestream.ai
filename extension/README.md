<p align="center">
  <a href="https://clerk.com?utm_source=github&utm_medium=owned" target="_blank" rel="noopener noreferrer">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="./assets/light-logo.png">
      <img alt="Clerk Logo for light background" src="./assets/dark-logo.png" height="64">
    </picture>
  </a>
  <br />
</p>
<div align="center">
  <h1>
    Clerk and Chrome Extension Quickstart 
  </h1>  
  <a href="https://www.npmjs.com/package/@clerk/clerk-js">
    <img alt="Downloads" src="https://img.shields.io/npm/dm/@clerk/clerk-js" />
  </a>
  <a href="https://discord.com/invite/b5rXHjAg7A">
    <img alt="Discord" src="https://img.shields.io/discord/856971667393609759?color=7389D8&label&logo=discord&logoColor=ffffff" />
  </a>
  <a href="https://twitter.com/clerkdev">
    <img alt="Twitter" src="https://img.shields.io/twitter/url.svg?label=%40clerkdev&style=social&url=https%3A%2F%2Ftwitter.com%2Fclerkdev" />
  </a> 
  <br />
  <br />
  <img alt="Clerk Hero Image" src="./assets/hero.png">
</div>

## Introduction

Clerk is a developer-first authentication and user management solution. It provides pre-built React components and hooks for sign-in, sign-up, user profile, and organization management. Clerk is designed to be easy to use and customize, and can be dropped into any Chrome Extension application.

After following the quickstart you'll have learned how to:

- Scaffold a new application using the Plasmo framework
- Install `@clerk/chrome-extension`
- Set your environment variables
- Add `<ClerkProvider>` to your application
- Create a header with Clerk components for users to sign in and out
- Configure a consistent CRX key
- Load your Chrome Extension into your Chromium-based browser
- Test your Chrome Extension

## Running the template

```bash
git clone https://github.com/clerkinc/clerk-chrome-extension-quickstart
```

To run the example locally, you need to:

1. Sign up for a Clerk account at [https://clerk.com](https://dashboard.clerk.com/sign-up?utm_source=readme&utm_medium=owned&utm_campaign=chrome-extension&utm_content=10-24-2023&utm_term=clerk-chrome-extension-quickstart).

2. Go to the [Clerk dashboard](https://dashboard.clerk.com?utm_source=readme&utm_medium=owned&utm_campaign=chrome-extension&utm_content=10-24-2023&utm_term=clerk-chrome-extension-quickstart) and create an application.

3. Set the required Clerk environment variables as shown in [the example `.env.development` file](./.env.development.example).

4. Create a [consistent CRX ID](https://clerk.com/docs/references/chrome-extension/configure-consistent-key) for your extension.

5. Set the public key are shown in [the example `.env.chrome` file](./.env.chrome.example).

5. `pnpm install` the required dependencies.

6. `pnpm dev` to launch the development server.

## Learn more

To learn more about Clerk and Chrome Extensions, check out the following resources:

- [Quickstart: Get started with Chrome Extensions and Clerk](https://clerk.com/docs/quickstarts/chrome-extension?utm_source=readme&utm_medium=owned&utm_campaign=chrome-extension&utm_content=10-24-2023&utm_term=clerk-chrome-extension-quickstart)

- [Clerk Documentation](https://clerk.com/docs?utm_source=readme&utm_medium=owned&utm_campaign=chrome-extension&utm_content=10-24-2023&utm_term=clerk-chrome-extension-quickstart)
- [Chrome Extensions](https://developer.chrome.com/docs/extensions)

## Found an issue or want to leave feedback

Feel free to create a support thread on our [Discord](https://clerk.com/discord). Our support team will be happy to assist you in the `#support` channel.

## Connect with us

You can discuss ideas, ask questions, and meet others from the community in our [Discord](https://discord.com/invite/b5rXHjAg7A).

If you prefer, you can also find support through our [Twitter](https://twitter.com/ClerkDev), or you can [email](mailto:support@clerk.dev) us!
