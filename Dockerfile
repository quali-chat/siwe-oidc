FROM clux/muslrust:stable as chef
WORKDIR /siwe-oidc
RUN cargo install cargo-chef

FROM chef as dep_planner
COPY ./src/ ./src/
COPY ./Cargo.lock ./
COPY ./Cargo.toml ./
COPY ./siwe-oidc.toml ./
RUN cargo chef prepare  --recipe-path recipe.json

FROM chef as dep_cacher
COPY --from=dep_planner /siwe-oidc/recipe.json recipe.json
RUN cargo chef cook --release --recipe-path recipe.json

FROM node:18-alpine as node_builder
ARG VITE_PROJECT_ID
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
ARG VITE_PROJECT_ID
ENV VITE_PROJECT_ID=$VITE_PROJECT_ID
# if you are on mac or the image doesn't include python then uncomment the following line
# RUN apk add --no-cache python3 make g++
ADD --chown=node:node ./static /siwe-oidc/static
ADD --chown=node:node ./js/oidc-ui /siwe-oidc/js/oidc-ui
WORKDIR /siwe-oidc/js/oidc-ui
COPY js/oidc-ui/.env ./.env
RUN npm install
RUN npm run build

FROM chef as builder
COPY --from=dep_cacher /siwe-oidc/target/ ./target/
COPY --from=dep_cacher $CARGO_HOME $CARGO_HOME
COPY --from=dep_planner /siwe-oidc/ ./
RUN cargo build --release

FROM alpine
# if you are on arm64 machines then use the following line
# COPY --from=builder /siwe-oidc/target/aarch64-unknown-linux-musl/release/siwe-oidc /usr/local/bin/
COPY --from=builder /siwe-oidc/target/x86_64-unknown-linux-musl/release/siwe-oidc /usr/local/bin/
WORKDIR /siwe-oidc
RUN mkdir -p ./static
COPY --from=node_builder /siwe-oidc/static/ ./static/
COPY --from=builder /siwe-oidc/siwe-oidc.toml ./
ENV SIWEOIDC_ADDRESS="0.0.0.0"
EXPOSE 8000
ENTRYPOINT ["siwe-oidc"]
LABEL org.opencontainers.image.source https://github.com/spruceid/siwe-oidc
LABEL org.opencontainers.image.description "OpenID Connect Identity Provider for Sign-In with Ethereum"
LABEL org.opencontainers.image.licenses "MIT OR Apache-2.0"
