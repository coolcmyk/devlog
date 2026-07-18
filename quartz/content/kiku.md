---
title: Kiku (聞く, to listen) — Transcription Engine Built in Rust

tags:
  - rust
  - projects
  - experiences

date: 2026-07-19
---

>### what:
[kiku](https://github.com/kioku-org/kiku) is a minimal transcription engine written in rust. audio in, transcript out — that's the whole contract. it powers the transcription layer of [kioku](https://github.com/kioku-org/kioku), but it's built to be generally usable by anyone.

>### why:
kioku's original transcription-service was a python fastapi app wrapping faster-whisper, and over time it accumulated everything: admission control, concurrency semaphores, tier queues, retry logic, silence heuristics, three STT backends. the engine and the orchestration were living in the same file.

tl;dr it was really sloppy and i couldn't comprehend any logic behind of the things, well i use AI too for dev, but i often use it in like mentor-mode to really let myself form a mental model first and learn about rust in general, before actually shipping it

so the split: **kiku is the engine, kioku is the orchestrator.** all the tier management, queueing, and scaling policy stays in kioku.

>### design:
one enum, two backends:

- **cloud** — OpenRouter's `/audio/transcriptions` endpoint. one call, any STT model they route: chirp-3, gpt-4o-transcribe, whisper-large-v3.
- **local** — whisper.cpp through `whisper-rs`, behind a `local-whisper` cargo feature so the default build needs no C++ toolchain.

```rust
let engine = Engine::from_config(&cfg)?; // model loads once, here
let t = engine.transcribe(&audio, "wav", None).await?; // call forever
```

went with an enum instead of a trait object — `async fn` in traits isn't dyn-safe without the `async-trait` crate, the backends are known at compile time, and the compiler yells if a variant forgets to implement. boring wins.

some small things i like:

- **one `MODEL` env var** for both worlds: an openrouter id (`openai/gpt-4o-mini-transcribe`) or a ggml name (`large-v3`, `tiny`) — local models auto-download from `ggerganov/whisper.cpp` on first run.
- **any PCM wav works**: multichannel gets downmixed, non-16kHz gets resampled with a hand-rolled linear interpolation resampler (~15 lines, plenty for speech).
- **fine-tunes**: a single shell script converts any HF transformers whisper fine-tune to ggml. i'm testing [cobrayyxx/whisper-small-indo-eng](https://huggingface.co/cobrayyxx/whisper-small-indo-eng) for indonesian-english meetings.
- **tests without the network**: the integration tests spin up a fake OpenRouter with axum on port 0, capture the request body, and assert the base64 audio round-trips. no mock library, axum was already there.

>### status:
shipped on crates.io!
```
https://crates.io/crates/kiku
```


enjoy the `cargo install kiku` :)
