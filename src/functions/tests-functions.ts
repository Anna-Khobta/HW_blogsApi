import express from "express";
import request from "supertest";
import {
    basicAuth,
    blogDescription,
    blogName,
    blogNameDescriptionUrl,
    blogUrl,
    commentContent,
    fourthEmail,
    fourthLogin,
    fourthPassword,
    loginOrEmailPassw,
    myEmail,
    myLogin,
    myLoginOrEmail,
    myPassword,
    newPassword,
    postContent,
    postShortDescription,
    postTitle,
    secondCommentContent,
    secondEmail,
    secondLogin,
    thirdEmail,
    thirdLogin,
    thirdPassword
} from "./tests-objects";
import {app} from "../settings";
import {LikeStatusesEnum} from "../repositories/db/types";


// 🌺🌺🌺 BLOGS

export const createBlog = async (blogName: string, blogDescription: string, blogUrl: string) => {

    return request(app)
        .post('/blogs')
        .set('Authorization', basicAuth)
        .send({
            "name": blogName,
            "description": blogDescription,
            "websiteUrl": blogUrl
    })
}

export const getBlogById = async (id:string|null) => {
    return request(app)
        .get('/blogs/' + id)
}

export const getBlogsWithPagination = async (sortBy:string|null,
                                             sortDirection: string|null,
                                             pageNumber: string|null,
                                             pageSize: string|null) => {

    return request(app)
        .get('/blogs/' + '?'+ sortBy + '&'+sortDirection +'&'+ pageNumber + '&'+ pageSize)
}

export const getPostsForBlogWithPagination = async (blogId: string,
                                                    sortBy:string|null,
                                             sortDirection: string|null,
                                             pageNumber: string|null,
                                             pageSize: string|null) => {

    return request(app)
        .get('/blogs/' + blogId + "/posts/" +'?'+ sortBy + '&'+sortDirection +'&'+ pageNumber + '&'+ pageSize)
}


// 🌺🌺🌺 POSTS

export const createPost = async (title: string, shortDescription: string, content: string, blogId:string ) => {

    return request(app)
        .post('/posts')
        .set('Authorization', basicAuth)
        .send({
        "title": title,
        "shortDescription": shortDescription,
        "content": content,
        "blogId": blogId
        })
}

export const getPostById = async (postId:string|null) => {
    return request(app)
        .get('/posts/' + postId)
}

export const getPostByIdWithAuth = async (postId: string, userAccessToken: string) => {

    return request(app)
        .get('/posts/' + postId)
        .auth(userAccessToken, {type: 'bearer'})
}


export const getPostsWithPagination = async (sortBy:string|null,
                                             sortDirection: string|null,
                                             pageNumber: string|null,
                                             pageSize: string|null) => {

    return request(app)
        .get('/posts/' + '?'+ sortBy + '&'+sortDirection +'&'+ pageNumber + '&'+ pageSize)
}


export const getPostsWithPaginationWithAuth = async (sortBy:string|null,
                                             sortDirection: string|null,
                                             pageNumber: string|null,
                                             pageSize: string|null,
                                                     userAccessToken: string) => {

    return request(app)
        .get('/posts/' + '?' + sortBy + '&' + sortDirection + '&' + pageNumber + '&' + pageSize)
        .auth(userAccessToken, {type: 'bearer'})
}


export const updatePost = async (title: string, shortDescription: string, content: string, blogId:string, postId: string ) => {

    return request(app)
        .put('/posts/' + postId)
        .set('Authorization', basicAuth)
        .send({
            "title": title,
            "shortDescription": shortDescription,
            "content": content,
            "blogId": blogId
        })
}

export const deletePostById = async (id: string|null ) => {
    return request(app)
        .delete('/posts/' + id)
        .set('Authorization', basicAuth)
}

export const updatePostLikeStatus = async (postId: string, userAccessToken: string, likeStatus: LikeStatusesEnum) => {

    return request(app)
        .put('/posts/' + postId + '/like-status')
        .auth(userAccessToken, {type: 'bearer'})
        .send({
            "likeStatus": likeStatus
        })
}




// 🌺🌺🌺 POSTS2

export async function createPostWithBlog (app: express.Application)
{
    const createdResponseBlog = await request(app)
        .post('/blogs')
        .set('Authorization', basicAuth)
        .send(blogNameDescriptionUrl)
        .expect(201);
    const createdBlog = createdResponseBlog.body;

    const createdResponsePost = await request(app)
        .post('/posts')
        .set('Authorization', basicAuth)
        .send({
            "title": "1post title",
            "shortDescription": "1post string",
            "content": "1post string",
            "blogId": createdBlog.id
        })
        .expect(201);

    return createdResponsePost.body;
}



// 🌺🌺🌺 USERS

export async function createUser (login:string, password: string, email: string, basicAuth: string) {
    return request(app)
        .post('/users')
        .set('Authorization', basicAuth)
        .send({    "login": login,
            "password": password,
            "email": email})
}

export const getUsersWithPagination = async (sortBy:string|null, sortDirection: string|null, pageNumber: string|null, pageSize: string|null, searchLoginTerm:string|null, searchEmailTerm:string|null) => {

    return request(app)
    .get('/users/' + '?'+ sortBy + '&'+sortDirection +'&'+ pageNumber + '&'+ pageSize + '&'+ searchLoginTerm + '&'+ searchEmailTerm)
    .set('Authorization', basicAuth)
}

export async function deleteAllCreateUser (login:string, password: string, email: string, basicAuth: string) {

    await request(app)
        .delete('/testing/all-data')
        .expect(204)

    return request(app)
        .post('/users')
        .set('Authorization', basicAuth)
        .send({    "login": login,
            "password": password,
            "email": email})
}

// 🌺🌺🌺 DEVICES

export const getAllUserDevices = async (cookies: any) => {
    return  request(app)
        .get("/security/devices")
        .set('Cookie', cookies)
}

export const deleteByDeviceId = async (deviceId: string|null|number, cookies:any) => {
    return request(app)
        .delete("/security/devices/" + deviceId)
        .set('Cookie', cookies)
}


// 🌺🌺🌺 AUTH

export const authLogin = (loginOrEmail:string, password: string) => {
    return request(app)
        .post("/auth/login")
        .send(    {
            "loginOrEmail": loginOrEmail,
            "password": password})
}

export const authMe = (userAccessToken:string) => {
    return request(app)
        .get("/auth/me")
        .auth(userAccessToken, {type: 'bearer'})
}



export async function loginUserGetToken (app: express.Application) {

    const tryLogin = await request(app)
        .post('/auth/login')
        .send(loginOrEmailPassw)
        .expect(200)

    return tryLogin.body.accessToken
}

export const authRegistarion = (login:string, password: string, email: string) => {
    return request(app)
        .post("/auth/registration/")
        .send(    {"login": login,
        "password": password,
        "email": email})
}


export async function loginInSystem3 (app: express.Application): Promise <string>  {

   const login = await request(app)
        .post('/auth/login')
        .send(loginOrEmailPassw)
        .expect(200)

    const myCookies = login.headers['set-cookie'][0]

    expect(login.body).toMatchObject({
        "accessToken": expect.any(String)
    });

    expect(myCookies).toBeDefined()

    return myCookies
}

export const authRefreshToken = (refreshToken: string) => {
    return request(app)
        .post("/auth/refresh-token")
        .set('Cookie', refreshToken)
}

export const passwordRecovery = async (email: any) => {
    return request(app)
        .post('/auth/password-recovery')
        .send({email: email})
}

export const createNewPassword = async <T>(password: any, recoveryCode: any): Promise<{body: T, status: number}> => {

    const result = await request(app)
        .post('/auth/new-password')
        .send({
                "newPassword": password,
                "recoveryCode": recoveryCode
            }
        )

    return {
        body: result.body,
        status: result.status
    }
}


export const loginInSystem = async (loginOrEmail: any, password: any) => {

    return request(app)
        .post('/auth/login')
        .send({
            "loginOrEmail": loginOrEmail,
            "password": password
        })
}

// 🌺🌺🌺 COMMENTS

export const createComment = async (postId: string, userAccessToken: string) => {

    return request(app)
        .post('/posts/' + postId + '/comments')
        .auth(userAccessToken, {type: 'bearer'})
        .send({
            "content": commentContent
        })
}

export const getCommentById = async (commentId: string) => {
    return request(app)
        .get('/comments/' + commentId)

}

export const getAllCommentsOfPost = async (postId: string, userAccessToken: string) => {
    return request(app)
        .get('/posts/' + postId + '/comments/')
        .auth(userAccessToken, {type: 'bearer'})

}



export const getNewCommentWithLike = async (commentId: string, userAccessToken: string) => {

    return request(app)
        .get('/comments/' + commentId)
        .auth(userAccessToken, {type: 'bearer'})

}

export const getNewCommentWithAuthCookies = async (commentId: string, cookies: string) => {

    return request(app)
        .get('/comments/' + commentId)
        .set('Cookie', cookies)

}



export const getCommentsWithPagination =
    async (sortBy:string|null,
           sortDirection: string|null,
           pageNumber: string|null,
           pageSize: string|null,
           postId:string) => {

    return request(app)
        .get('/posts/' + postId + "/comments/" + "?" + sortBy + '&'+sortDirection +'&'+ pageNumber + '&'+ pageSize)
}

export const getCommentsWithPaginationWithAuth =
    async (sortBy:string|null,
           sortDirection: string|null,
           pageNumber: string|null,
           pageSize: string|null,
           postId:string,
           userAccessToken: string) => {

        return request(app)
            .get('/posts/' + postId + "/comments/" + "?" + sortBy + '&'+sortDirection +'&'+ pageNumber + '&'+ pageSize)
            .auth(userAccessToken, {type: 'bearer'})
    }

export const updateComment = async (commentId: string, userAccessToken: string) => {

    return request(app)
        .put('/comments/' + commentId)
        .auth(userAccessToken, {type: 'bearer'})
        .send({
            "content": secondCommentContent
        })
}

export const updateCommentLikeStatus = async (commentId: string, userAccessToken: string, likeStatus: LikeStatusesEnum) => {

    return request(app)
        .put('/comments/' + commentId + '/like-status')
        .auth(userAccessToken, {type: 'bearer'})
        .send({
            "likeStatus": likeStatus
        })
}

export const deleteComment = async (commentId: string, userAccessToken: string) => {

    return request(app)
        .delete('/comments/' + commentId)
        .auth(userAccessToken, {type: 'bearer'})
}


// 🌺🌺🌺 OTHER

export const fiveRequests = async (url: string, someBody: any) => {

    const maxRequests = 5;
    const requests = [];

    // Send more than `maxRequests` requests within `interval` time
    for (let i = 0; i <= maxRequests; i++) {
        requests.push(
            request(app)
                .post(url)
                .set('Authorization', basicAuth)
                .send(someBody)
        );
    }

    // Wait for all requests to complete
    const responses = await Promise.all(requests);

    return responses[maxRequests].status
}

export const createSeveralItems = async (numberTimes: number, url: string, someBody: any, authChoose: string) => {

    let items = []

    for (let i = 0; i < numberTimes; i++) {
        const createResponse = await request(app)
            .post(url)
            .set('Authorization', authChoose)
            .send(
                someBody
            )
        items.push(createResponse.body)
    }
    return items
}

export const waitSomeSeconds = async (seconds: number) => {

    const interval = seconds * 1000; // in milliseconds
    await new Promise(resolve => setTimeout(resolve, interval));

}

export const clearAllDb = async () => {
    await request(app).delete('/testing/all-data')
}


type testCreateAll = {
    createdUserAccessToken:string,
    newCommentId:string,
    newCommentContent:string,
    newCommentUserId:string,
    newCommentUserLogin:string,
    newCommentCreatedAt :string,
    newPostId:string,
    newPostTitle:string,
    newPostShortDescription:string,
    newPostContent:string,
    newPostCreatedAt:string,
    newBlogId:string,
    newBlogName:string,
    newUserId: string,
    newUserLogin:string

}

type test2_3_4UsersTokensAndId = {
    createdUser2AccessToken:string,
    createdUser3AccessToken:string,
    createdUser4AccessToken:string,

    user2Id:string,
    user3Id:string,
    user4Id:string,
}


export const createBlogPostUserLoginComment = async (): Promise<testCreateAll> => {

    await clearAllDb()

    const createNewBlog = await createBlog(blogName, blogDescription, blogUrl)
    expect(createNewBlog.status).toBe(201)

    const createNewPost = await createPost(postTitle, postShortDescription, postContent, createNewBlog.body.id)
    expect(createNewPost.status).toBe(201)

    const createNewUser = await createUser(myLogin, myPassword, myEmail, basicAuth)
    expect(createNewUser.status).toBe(201)

    const loginMyUser = await authLogin(myLoginOrEmail, myPassword)
    expect(loginMyUser.status).toBe(200)

    const createdUserAccessToken = loginMyUser.body.accessToken

    const createNewComment = await createComment(createNewPost.body.id, createdUserAccessToken)
    expect(createNewComment.status).toBe(201)

    const newCommentId = createNewComment.body.id
    const newCommentContent =  createNewComment.body.content
    const newCommentUserId = createNewComment.body.commentatorInfo.userId
    const newCommentUserLogin = createNewComment.body.commentatorInfo.userLogin
    const newCommentCreatedAt = createNewComment.body.createdAt

    const newPostId = createNewPost.body.id
    const newPostTitle = createNewPost.body.title
    const newPostShortDescription = createNewPost.body.shortDescription
    const newPostContent = createNewPost.body.content
    const newPostCreatedAt = createNewPost.body.createdAt

    const newBlogId = createNewBlog.body.id
    const newBlogName = createNewBlog.body.name

    const newUserLogin = createNewUser.body.login
    const newUserId = createNewUser.body.id

    return {createdUserAccessToken, newCommentId, newCommentContent, newCommentUserId,newCommentUserLogin, newCommentCreatedAt, newPostId,
        newPostTitle, newPostShortDescription, newPostContent, newPostCreatedAt, newBlogId, newBlogName,
        newUserId, newUserLogin
    }
}


export const createUser2_3_4 = async (): Promise<test2_3_4UsersTokensAndId> => {

    const createNewUser2 = await createUser(secondLogin, newPassword, secondEmail, basicAuth)
    expect(createNewUser2.status).toBe(201)

    const loginMyUser2 = await authLogin(secondLogin, newPassword)
    expect(loginMyUser2.status).toBe(200)

    const createdUser2AccessToken = loginMyUser2.body.accessToken
    const user2Id= createNewUser2.body.id


    const createNewUser3 = await createUser(thirdLogin, thirdPassword, thirdEmail, basicAuth)
    expect(createNewUser3.status).toBe(201)

    const loginMyUser3 = await authLogin(thirdLogin, thirdPassword)
    expect(loginMyUser3.status).toBe(200)

    const createdUser3AccessToken = loginMyUser3.body.accessToken
    const user3Id= createNewUser3.body.id


    const createNewUser4 = await createUser(fourthLogin, fourthPassword, fourthEmail, basicAuth)
    expect(createNewUser4.status).toBe(201)

    const loginMyUser4 = await authLogin(fourthLogin, fourthPassword)
    expect(loginMyUser4.status).toBe(200)

    const createdUser4AccessToken = loginMyUser4.body.accessToken
    const user4Id= createNewUser4.body.id



    return {createdUser2AccessToken, createdUser3AccessToken, createdUser4AccessToken,
        user2Id, user3Id, user4Id,
    }
}

export const createUser2 = async (): Promise<testCreateAll> => {

    const createNewUser = await createUser(secondLogin, newPassword, secondEmail, basicAuth)
    expect(createNewUser.status).toBe(201)

    const loginMyUser = await authLogin(secondLogin, newPassword)
    expect(loginMyUser.status).toBe(200)

    return loginMyUser.body.accessToken
}
