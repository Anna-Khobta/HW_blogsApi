import {Router} from "express";
import {authorizationMiddleware} from "../middlewares/authorization";
import {inputValidationMiddleware} from "../middlewares/input-validation-middleware";

import {
    contentValidation,
    idValidation,
    shortDescriptionValidation,
    titleValidation
} from "../middlewares/posts-validations";
import {authBearerFindUser, authBearerMiddleware} from "../middlewares/authToken";
import {contentCommentValidation, likeStatusValidation} from "../middlewares/comments-validation";
import {container} from "../composition-root";
import {PostsController} from "./posts-controller";


const postsController = container.resolve(PostsController)

export const postsRouter = Router({})

postsRouter
    .post('/',
        authorizationMiddleware,
        idValidation,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        inputValidationMiddleware, postsController.createPost.bind(postsController))

    .get('/',
        authBearerFindUser, postsController.getPost.bind(postsController))


    .get('/:id',
        authBearerFindUser,
        postsController.getPostById.bind(postsController))


    .put('/:id',
        authorizationMiddleware,
        idValidation,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        inputValidationMiddleware,
        postsController.updatePost.bind(postsController))

    .delete('/:id',
        authorizationMiddleware,
        postsController.deletePostById.bind(postsController))


    // POSTS - COMMENTS
    .post('/:postId/comments',
        authBearerMiddleware,
        contentCommentValidation,
        inputValidationMiddleware,
        postsController.createCommentForPost.bind(postsController))

    // return all comments for special post
    .get('/:postId/comments',
        authBearerFindUser,
        postsController.getCommentsForPost.bind(postsController))


    // Make like/unlike/dislike/undislike operation
    .put('/:postId/like-status',
        likeStatusValidation,
        authBearerMiddleware,
        inputValidationMiddleware,
        postsController.updateCommentForPost.bind(postsController))



/*
postsRouter
    .post('/',
        authorizationMiddleware,
        idValidation,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        inputValidationMiddleware, postsControllerInstance.createPost.bind(postsControllerInstance))

    /!*async (req: Request, res: Response) => {

        const createdPostId = await postsService.createPost(req.body.title, req.body.shortDescription, req.body.content, req.body.blogId)

        if (!createdPostId) {
            return res.status(404)
        }
        const postView = await postsQueryRepositories.findPostById(createdPostId)
        res.status(201).send(postView)
    })*!/

    .get('/',
        authBearerFindUser,
        async (req: Request, res: Response) => {
            const userInfo = req.user

            const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query)

            if (!userInfo) {
                const foundPostsWithoutUser = await postsQueryRepositories.findPosts(null, page, limit, sortDirection, sortBy, skip)
                res.status(200).send(foundPostsWithoutUser)

            } else {
                const foundPostsWithUser = await postsQueryRepositories.findPostsWithUser(null, page, limit, sortDirection, sortBy, skip, userInfo.id)
                res.status(200).send(foundPostsWithUser)
            }
        })


    .get('/:id',
        authBearerFindUser,
        async (req: Request, res: Response) => {

            let userInfo = req.user

            if (!userInfo) {
                const findPostWithoutUserInfo = await postsQueryRepositories.findPostByIdWithoutUser(req.params.id)

                if (!findPostWithoutUserInfo) {
                    return res.status(404)
                }
                return res.status(200).send(findPostWithoutUserInfo)
            }

            let findPostWithAuth = await postsQueryRepositories.findPostByIdWithUser(req.params.id, userInfo.id)

            if (!findPostWithAuth) {
                return res.status(404)
            } else {
                return res.status(200).send(findPostWithAuth)
            }
        })

    .put('/:id',
        authorizationMiddleware,
        idValidation,
        titleValidation,
        shortDescriptionValidation,
        contentValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {

            const updatedPostId = await postsService.updatePost(req.params.id, req.body.title,
                req.body.shortDescription, req.body.content, req.body.blogId)

            if (!updatedPostId) {
                return res.sendStatus(404)
            } else {
                return res.sendStatus(204)
            }
        })

    .delete('/:id',
        authorizationMiddleware,
        async (req: Request, res: Response) => {

            const isDeleted = await postsService.deletePost(req.params.id)

            if (isDeleted) {
                res.sendStatus(204)
            } else {
                res.sendStatus(404)
            }
        })


    // POSTS - COMMENTS
    .post('/:postId/comments',
        authBearerMiddleware,
        contentCommentValidation,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {

            const post = await postsQueryRepositories.findPostById(req.params.postId)

            const userInfo = req.user

            if (!post) {
                return res.sendStatus(404)
            }

            const newComment = await commentsService.createComment(post.id, req.body.content, userInfo!)
            res.status(201).send(newComment)

        })

    // return all comments for special post
    .get('/:postId/comments',
        authBearerFindUser,
        async (req: Request, res: Response) => {
            const userInfo = req.user

            const {page, limit, sortDirection, sortBy, skip} = getPagination(req.query)

            let post = await postsQueryRepositories.findPostById(req.params.postId)

            if (!post) {
                return res.sendStatus(404)
            }

            if (!userInfo) {
                const foundComments = await commentsQueryRepositories.findCommentsForPost(post.id, page, limit, sortDirection, sortBy, skip)
                res.status(200).send(foundComments)
            } else {
                const foundCommentsWithUserId = await commentsQueryRepositories.findCommentsForPostWithUser(post.id, page, limit, sortDirection, sortBy, skip, userInfo.id)
                res.status(200).send(foundCommentsWithUserId)
            }
        })


    // Make like/unlike/dislike/undislike operation
    .put('/:postId/like-status',
        likeStatusValidation,
        authBearerMiddleware,
        inputValidationMiddleware,
        async (req: Request, res: Response) => {

            const userInfo = req.user // id юзера, который залогинен и хочет лайкнуть
            const likeStatus = req.body.likeStatus

            const findPostById = await postsQueryRepositories.findPostById(req.params.postId)

            if (!findPostById) {
                return res.sendStatus(404)
            }

            const updateLikeStatus = await postsService.createLikeStatus(userInfo, findPostById, req.params.postId, likeStatus)

            if (!updateLikeStatus) {
                return res.sendStatus(400)
            } else return res.sendStatus(204)

        })

*/
