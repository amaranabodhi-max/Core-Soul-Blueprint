# Searching for places in mainland China

> In this install the mainland-China services are off: `baidu_pano.py` and the 360 Maps / Baidu `poi.py` sources need `--allow-cn` and the user's consent. The Chinese keyword-search script was removed.

Region-specific half of `references/search.md`: which Chinese platforms to search and how to phrase queries. The general method (variants, engines, vote counting, after a hit) stays in `references/search.md`.

## Chinese keyword search

Use your general web search tools with Chinese queries (text only, never the photo). Coverage of Chinese platforms is limited.

## Where to search by object type (China)

| Object | Where to search | Source |
|---|---|---|
| Scenic-area buildings, viral check-in spots | Douyin, Xiaohongshu, Weibo keyword and image search; official scenic-area accounts post videos from the same angle | v010-2, v009 |
| Statues, small park features | User photos in Ctrip reviews | v010-6 |
| New residential developments, commercial complexes | Housing-development albums on property sites (Anjuke, Fang.com, Loupan.com, etc.): the "周边配套" (nearby amenities) and "实景图" (real photos) sections; page all the way to the signboard | v010-5 |
| Old buildings, historic sites | Local culture-and-tourism and protected-heritage-site pages; Visual China Group captions carry place names and years | v004 |
| Ordinary streets, when even the city isn't fixed | Sample one page of arterial-road street view per candidate city and compare municipal fixtures (`baidu_pano.py sample --allow-cn`) | — |
| Vehicle livery (bus, taxi, school bus) | web search for "<city> <color description> 公交" (Chinese for <city> <color description> bus), and read route signs and company names from the result images; first resolve any place name you read to a district (county) with `poi.py` before using it; don't treat a vehicle from district A as a clue for district B | v014 |

## Social media

- Viral scenery: search `<city> + <scenery>` on Douyin, Xiaohongshu and Weibo, in both Chinese and English.
- Locals' photos of the same mountains or the same river: look in the candidate township's "同城" (local) feed or its place page (the v010-1 creator spoofed the device location to the candidate township to browse local content).
- IP location labels on posts and comments are covered in `clues.md` (Platform and metadata).
