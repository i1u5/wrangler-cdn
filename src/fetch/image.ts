import { jsonError } from '../jsonError'
import config from '../config'

export async function image(uri: URL, event: FetchEvent): Promise<Response> {
    let id = uri.pathname.substring(1)

    let url = `https://i.imgur.com/${id}`
    const cache = caches.default

    const options = {
        headers: {
            'User-Agent': config.userAgent,
            Accept: config.acceptHeader,
        },
    }

    if (id.includes('.gifv')) {
        id = id.replace('.gifv', '.mp4')
        return Response.redirect(`${uri.origin}/${id}`)
    }

    let response = await cache.match(url)

    if (!response) {
        const imageResponse = await fetch(url, options)

        const headers = {
            'cache-control': 'public, max-age=31536000',
        }

        const cloned = imageResponse.clone()

        response = new Response(cloned.body, {
            ...cloned,
            headers,
        })

        const type = imageResponse.headers.get('content-type')

        if (
            type &&
            imageResponse.status >= 200 &&
            imageResponse.status <= 300 &&
            imageResponse.redirected == false // Imgur redirect on 404 error
        ) {
            event.waitUntil(cache.put(url, imageResponse.clone()))
        } else {
            return jsonError('Not found', 404)
        }
    }

    if (response?.url?.includes('.mp4')) {
        response.headers.set('content-type', 'video/mp4')
    }

    return response
}
