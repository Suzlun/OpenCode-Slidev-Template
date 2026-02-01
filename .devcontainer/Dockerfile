FROM node:24-bookworm

SHELL ["/bin/bash", "-o", "pipefail", "-c"]

ENV DEBIAN_FRONTEND=noninteractive
ARG PNPM_VERSION=10.28.2
ARG PLAYWRIGHT_VERSION=1.58.1
ARG OPENCODE_VERSION=1.1.48

ENV LANG=en_US.UTF-8
ENV LC_ALL=en_US.UTF-8
ENV PLAYWRIGHT_BROWSERS_PATH=/ms-playwright

RUN apt-get update \
  && apt-get install -y --no-install-recommends \
    bash-completion \
    ca-certificates \
    curl \
    fonts-liberation \
    fonts-noto-cjk \
    fonts-noto-color-emoji \
    git \
    gnupg \
    g++ \
    jq \
    less \
    locales \
    make \
    openssh-client \
    pkg-config \
    procps \
    python3 \
    ripgrep \
    sudo \
    unzip \
    xz-utils \
    zip \
  && rm -rf /var/lib/apt/lists/*

RUN echo "en_US.UTF-8 UTF-8" > /etc/locale.gen \
  && locale-gen

RUN echo "node ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/node \
  && chmod 0440 /etc/sudoers.d/node

RUN corepack enable \
  && corepack prepare "pnpm@${PNPM_VERSION}" --activate

RUN npm install -g "opencode-ai@${OPENCODE_VERSION}" \
  && opencode --version

RUN mkdir -p /ms-playwright \
  && chown -R node:node /ms-playwright

RUN npx -y "playwright@${PLAYWRIGHT_VERSION}" install-deps chromium

USER node

RUN npx -y "playwright@${PLAYWRIGHT_VERSION}" install chromium
