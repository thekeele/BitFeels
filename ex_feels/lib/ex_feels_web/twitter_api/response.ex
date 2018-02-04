defmodule ExFeelsWeb.TwitterApi.Response do

  def parse_to_tweets(statuses) do
    Enum.map(statuses, fn status ->
      tweet =
        if is_nil(status["retweeted_status"]) do
          parse_status_data(status)
        else
          parse_status_data(status["retweeted_status"])
        end

      tweet
      |> Map.put("hashtags", parse_hashtags_data(status["entities"]["hashtags"]))
      |> Map.put("user", parse_user_data(status["user"]))
    end)
  end

  defp parse_status_data(status) do
    keys = ["created_at", "id", "full_text", "retweet_count", "favorite_count", "lang"]

    Map.take(status, keys)
  end

  defp parse_hashtags_data(hashtags) do
    Enum.map(hashtags, fn hashtag -> hashtag["text"] end)
  end

  defp parse_user_data(user) do
    keys = [
      "id", "screen_name", "followers_count", "favourites_count", "time_zone",
      "verified", "statuses_count"
    ]

    Map.take(user, keys)
  end
end
