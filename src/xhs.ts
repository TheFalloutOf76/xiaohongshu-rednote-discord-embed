import { jsonrepair } from 'jsonrepair'

interface XhsPost {
    url: string;
    id: string;
    xsecToken: string;
    type: string;
    author: {
        name: string;
        pfp: string;        
    }
    title: string;
    content: string;
    userInteraction: {
        like: string;
        comment: string;
        share: string;
        save: string;
    }
    images?: string[];
    video?: string;
}

const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

async function getPost(shareId: string): Promise<XhsPost> {
    const sharePage = await fetch(`http://xhslink.com/a/${shareId}`, {
        redirect: 'manual',
        headers: {
            'user-agent': userAgent,
        },
    });
    let postUrl = sharePage.headers.get('location');
    if (!postUrl) { throw new Error('Unable to find the location header'); }
    postUrl = postUrl.replace('discovery/item', 'explore');

    const postPage = await fetch(postUrl, {
        headers: {
            'user-agent': userAgent,
        },
    });
    const postHtml = await postPage.text();

    let match = postHtml.match(/<script>window.__INITIAL_STATE__=(.+?)<\/script>/);
    if (!match) { throw new Error('Unable to find the page data in the HTML'); }

    const pageData = JSON.parse(jsonrepair(match[1]));
    const postData = pageData.note.noteDetailMap[pageData.note.firstNoteId].note;

    const post: XhsPost = {
        url: postUrl,
        id: postData.noteId,
        xsecToken: postData.xsecToken,
        type: postData.type,
        author: {
            name: postData.user.nickname,
            pfp: postData.user.avatar,
        },
        title: postData.title,
        content: postData.desc,
        userInteraction: {
            like: postData.interactInfo.likedCount,
            comment: postData.interactInfo.commentCount,
            share: postData.interactInfo.shareCount,
            save: postData.interactInfo.collectedCount,
        },
        images: postData.imageList.map((image: any) => image.urlDefault),
    };

    if (postData.type == 'video') {
        post.video = postData.video.media.stream.h264[0].masterUrl;
    }

    return post;
}

export { getPost }
export type { XhsPost }