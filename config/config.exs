use Mix.Config

config :bitfeels, :sentiment,
  url: "http://0.0.0.0:5000/score",
  model: "spacy"
