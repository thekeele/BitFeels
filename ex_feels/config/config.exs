# This file is responsible for configuring your application
# and its dependencies with the aid of the Mix.Config module.
#
# This configuration file is loaded before any dependency and
# is restricted to this project.
use Mix.Config

# General application configuration
config :ex_feels,
  ecto_repos: [ExFeels.Repo]

# Configures the endpoint
config :ex_feels, ExFeelsWeb.Endpoint,
  url: [host: "localhost"],
  secret_key_base: "pPjWaKboi75SkVijD76Nx+a1wf7dZNnVBXywoBYL8ljeGabnbbGMXihno8SV9x5Q",
  render_errors: [view: ExFeelsWeb.ErrorView, accepts: ~w(html json)],
  pubsub: [name: ExFeels.PubSub,
           adapter: Phoenix.PubSub.PG2]

# Configures Elixir's Logger
config :logger, :console,
  format: "$time $metadata[$level] $message\n",
  metadata: [:request_id]

# Import environment specific config. This must remain at the bottom
# of this file so it overrides the configuration defined above.
import_config "#{Mix.env}.exs"