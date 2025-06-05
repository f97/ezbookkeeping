# Build backend binary file
FROM golang:1.24.2-alpine3.21 AS be-builder
ARG RELEASE_BUILD
ARG SKIP_TESTS
ENV RELEASE_BUILD=$RELEASE_BUILD
ENV SKIP_TESTS=$SKIP_TESTS
WORKDIR /go/src/github.com/mayswind/ezbookkeeping
COPY . .
RUN docker/backend-build-pre-setup.sh
RUN apk add git gcc g++ libc-dev
RUN ./build.sh backend

# Build frontend files
FROM --platform=$BUILDPLATFORM node:22.15.0-alpine3.21 AS fe-builder
ARG RELEASE_BUILD
ENV RELEASE_BUILD=$RELEASE_BUILD
WORKDIR /go/src/github.com/mayswind/ezbookkeeping
COPY . .
RUN docker/frontend-build-pre-setup.sh
RUN apk add git
RUN ./build.sh frontend

# Package docker image
FROM alpine:3.21.3
LABEL maintainer="MaysWind <i@mayswind.net>"

RUN apk --no-cache add tzdata

# Tạo thư mục app
WORKDIR /ezbookkeeping
RUN mkdir -p /ezbookkeeping/{data,log,storage}

# Copy app
COPY --from=be-builder /go/src/github.com/mayswind/ezbookkeeping/ezbookkeeping /ezbookkeeping/ezbookkeeping
COPY --from=fe-builder /go/src/github.com/mayswind/ezbookkeeping/dist /ezbookkeeping/public
COPY conf /ezbookkeeping/conf
COPY templates /ezbookkeeping/templates
COPY LICENSE /ezbookkeeping/LICENSE

# Copy entrypoint
COPY docker/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# EXPOSE và ENTRYPOINT
EXPOSE 8080
ENTRYPOINT ["/docker-entrypoint.sh"]
