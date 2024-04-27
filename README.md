# Transcendence
## Major module: Use a Framework as backend. ✅✅✅

In this major module, you are required to utilize a specific web framework for your
backend development, and that framework is Django .
You can create a backend without using the constraints of this module
by using the default language/framework. However, this module will
only be valid if you use the associated constraints.

## Minor module: Use a front-end framework or toolkit.✅✅✅

Your frontend development will utilize the Bootstrap toolkit .
You can create a front-end without using the constraints of this
module by using the default language/framework. However, this module
will only be valid if you use the associated constraints.

## Minor module: Use a database for the backend.✅✅✅

The designated database for all DB instances in your project is PostgreSQL .
This choice guarantees data consistency and compatibility across all project components and may be a prerequisite for other modules, such as the backend Framework module

## Major module: Standard user management, authentication, users across tournaments.✅✅✅

◦ Users can subscribe to the website in a secure way.
◦ Registered users can log in in a secure way.
◦ Users can select a unique display name to play the tournaments.
◦ Users can update their information.
◦ Users can upload an avatar, with a default option if none is provided.
◦ Users can add others as friends and view their online status.
◦ User profiles display stats, such as wins and losses.
◦ Each user has a Match History including 1v1 games, dates, and relevant
details, accessible to logged-in users.
Be carefull, the management of duplicate usernames/emails is at your
discretion. You must provide a justification for your decision.


## Major module: Implementing a remote authentication.✅✅✅

In this major module, the goal is to implement the following authentication system:
OAuth 2.0 authentication with 42 . Key features and objectives include:
Be carefull, the management of duplicate usernames/emails is at your
discretion. You must provide a justification for your decision.


## Major module: Multiplayers (more than 2 in the same game). ✅

It is possible to have more than two players. Each player needs a live control (so
the previous “Distant players” module is highly recommanded). It’s up to you to
define how the game could be played with 3, 4, 5, 6 ... players. Along with the
regular 2 players game, you can choose a single number of players, greater than
2, for this multiplayer module. Ex: 4 players can play on a squarred board, each
player owns one unique side of the square.


## Major module: Add Another Game with User History and Matchmaking.✅✅✅

In this major module, the objective is to introduce a new game, distinct from Pong,
and incorporate features such as user history tracking and matchmaking. Key
features and goals include:
◦ Develop a new, engaging game to diversify the platform’s offerings and entertain users.
◦ Implement user history tracking to record and display individual user’s gameplay statistics.
◦ Create a matchmaking system to allow users to find opponents and participate
in fair and balanced matches.
◦ Ensure that user game history and matchmaking data are stored securely and
remain up-to-date.
◦ Optimize the performance and responsiveness of the new game to provide an
enjoyable user experience. Regularly update and maintain the game to fix
bugs, add new features, and enhance gameplay.
This major module aims to expand your platform by introducing a new game,
enhancing user engagement with gameplay history, and facilitating matchmaking
for an enjoyable gaming experience.


## Minor module: Game Customization Options.✅

In this minor module, the goal is to provide customization options for all available
games on the platform. Key features and objectives include:
◦ Offer customization features, such as power-ups, attacks, or different maps,
that enhance the gameplay experience.
◦ Allow users to choose a default version of the game with basic features if they
prefer a simpler experience.
◦ Ensure that customization options are available and applicable to all games
offered on the platform.
◦ Implement user-friendly settings menus or interfaces for adjusting game parameters.
◦ Maintain consistency in customization features across all games to provide a
unified user experience.
This module aims to give users the flexibility to tailor their gaming experience
across all available games by providing a variety of customization options while
also offering a default version for those who prefer a straightforward gameplay
experience.

## Major module: Live chat.✅

You have to create a chat for your users in this module:
◦ The user should be able to send direct messages to other users.
◦ The user should be able to block other users. This way, they will see no more
messages from the account they blocked.
◦ The user should be able to invite other users to play a Pong game through the
chat interface.
◦ The tournament system should be able to warn users expected for the next
game.
◦ The user should be able to access other players profiles through the chat interface.


## Major module: Introduce an AI Opponent.✅✅✅

In this major module, the objective is to incorporate an AI player into the game.
Notably, the use of the A* algorithm is not permitted for this task. Key features
and goals include:
◦ Develop an AI opponent that provides a challenging and engaging gameplay
experience for users.
◦ The AI must replicate human behavior, meaning that in your AI implementation, you must simulate keyboard input. The constraint here is that the AI
can only refresh its view of the game once per second, requiring it to anticipate
bounces and other actions.
The AI must utilize power-ups if you have chosen to implement the
Game customization options module.
◦ Implement AI logic and decision-making processes that enable the AI player
to make intelligent and strategic moves.
◦ Explore alternative algorithms and techniques to create an effective AI player
without relying on A*.
◦ Ensure that the AI adapts to different gameplay scenarios and user interactions.
Attention: You will need to explain in detail how your AI functions
during your evaluation. Creating an AI that does nothing is strictly
prohibited; it must have the capability to win occasionally.
This major module aims to enhance the game by introducing an AI opponent that
adds excitement and competitiveness without relying on the A* algorithm.


## Minor module: User and Game Stats Dashboards ✅✅✅

In this minor module, the goal is to introduce dashboards that display statistics for
individual users and game sessions. Key features and objectives include:
◦ Create user-friendly dashboards that provide users with insights into their own
gaming statistics.
◦ Develop a separate dashboard for game sessions, showing detailed statistics,
outcomes, and historical data for each match.
◦ Ensure that the dashboards offer an intuitive and informative user interface
for tracking and analyzing data.
◦ Implement data visualization techniques, such as charts and graphs, to present
statistics in a clear and visually appealing manner.
◦ Allow users to access and explore their own gaming history and performance
metrics conveniently.
◦ Feel free to add any metrics you deem useful.
This minor module aims to empower users with the ability to monitor their gaming
statistics and game session details through user-friendly dashboards, providing a
comprehensive view of their gaming experience.

## Major module: Implement Two-Factor Authentication (2FA) and JWT.✅✅✅

In this major module, the goal is to enhance security and user authentication
by introducing Two-Factor Authentication (2FA) and utilizing JSON Web Tokens
(JWT). Key features and objectives include:
◦ Implement Two-Factor Authentication (2FA) as an additional layer of security
for user accounts, requiring users to provide a secondary verification method,
such as a one-time code, in addition to their password.
◦ Utilize JSON Web Tokens (JWT) as a secure method for authentication and
authorization, ensuring that user sessions and access to resources are managed
securely.
◦ Provide a user-friendly setup process for enabling 2FA, with options for SMS
codes, authenticator apps, or email-based verification.
◦ Ensure that JWT tokens are issued and validated securely to prevent unauthorized access to user accounts and sensitive data.
This major module aims to strengthen user account security by offering Two-Factor
Authentication (2FA) and enhancing authentication and authorization through the
use of JSON Web Tokens (JWT).


## Minor module: Expanding Browser Compatibility.✅

In this minor module, the objective is to enhance the compatibility of the web
application by adding support for an additional web browser. Key features and
objectives include:
◦ Extend browser support to include an additional web browser, ensuring that
users can access and use the application seamlessly.
◦ Conduct thorough testing and optimization to ensure that the web application
functions correctly and displays correctly in the newly supported browser.
◦ Address any compatibility issues or rendering discrepancies that may arise in
the added web browser.
◦ Ensure a consistent user experience across all supported browsers, maintaining
usability and functionality.
This minor module aims to broaden the accessibility of the web application by
supporting an additional web browser, providing users with more choices for their
browsing experience.


## Minor module: Multiple language supports.✅

In this minor module, the objective is to ensure that your website supports multiple
languages to cater to a diverse user base. Key features and goals include:
◦ Implement support for a minimum of three languages on the website to accommodate a broad audience.
◦ Provide a language switcher or selector that allows users to easily change the
website’s language based on their preferences.
◦ Translate essential website content, such as navigation menus, headings, and
key information, into the supported languages.
◦ Ensure that users can navigate and interact with the website seamlessly, regardless of the selected language.
◦ Consider using language packs or localization libraries to simplify the translation process and maintain consistency across different languages.
◦ Allow users to set their preferred language as a default choice for subsequent
visits to the website.
This minor module aims to enhance the accessibility and inclusivity of your website
by offering content in multiple languages, making it more user-friendly for a diverse
international audience.

