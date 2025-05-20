#!/usr/bin/env bash

cargo partisia-contract abi codegen --ts \
    ./rust/target/wasm32-unknown-unknown/release/trivia.abi \
    ./api/src/game/utils/TriviaApiGenerated.ts

cargo partisia-contract abi codegen --ts \
    ./rust/target/wasm32-unknown-unknown/release/trivia.abi \
    ./frontend/src/lib/TriviaApiGenerated.ts