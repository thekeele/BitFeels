defmodule Twitter do
  @moduledoc """
  Twitter API
  """

  @stream_opts [
    chunk_rate: 2_000,
    query_params: %{
      "track" => "bitcoin,crypto,currency,ethereum",
      "lang" => "en",
      "filter_level" => "none",
      "stall_warnings" => true,
      "tweet_mode" => "extended",
      "result_type" => "popular"
    }
  ]

  defdelegate search(query_params), to: Twitter.Search
  defdelegate start_streaming(stream_opts \\ @stream_opts), to: Twitter.Stream
  defdelegate stop_streaming(), to: Twitter.Stream
  defdelegate get_tweets(), to: Twitter.Stream
  defdelegate get_latest_tweet(), to: Twitter.Stream
end
