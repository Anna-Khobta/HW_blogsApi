import {PostModelClass,} from "./db/db";
import {LikeStatusesEnum, PostDbType, UserLikeInfo} from "./db/types";
import {HydratedDocument} from "mongoose";
import {injectable} from "inversify";

@injectable()
export class PostsDbRepository {
    async save(postInstance: HydratedDocument<PostDbType>): Promise<boolean> {
        try {
            await postInstance.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    async updatePost(postId: string, title: string, shortDescription: string, content: string): Promise<string | null> {

        const postInstance = await PostModelClass.findOne({_id: postId})

        if (!postInstance) {
            return null
        }

        //postInstance.updatePost()

        postInstance.title = title;
        postInstance.shortDescription = shortDescription;
        postInstance.content = content;

        try {
            await postInstance.save()
            return postInstance._id.toString()
        } catch (error) {
            console.log(error)
            return null
        }

    }

    async deletePost(id: string): Promise<boolean> {
        const result = await PostModelClass.findOneAndDelete({_id: id})
        return result !== null

    }

    async deleteAllPosts(): Promise<number> {
        const result = await PostModelClass.deleteMany({})
        return result.deletedCount
    }

    async createUserLikeInfoInDb(postId: string, userLikeInfo: UserLikeInfo, likeStatus: LikeStatusesEnum, likes: number, dislikes: number): Promise<boolean> {

        let userLikeInfoToAdd: UserLikeInfo = {
            userId: userLikeInfo.userId,
            createdAt: userLikeInfo.createdAt,
            userStatus: likeStatus
        }

        if (likeStatus === LikeStatusesEnum.Like) {
            likes++
        }

        if (likeStatus === LikeStatusesEnum.Dislike) {
            dislikes++
        }

        try {
            const postInstance = await PostModelClass.findOne({_id: postId})

            if (!postInstance) {
                return false
            }

            postInstance.likesCount = likes;
            postInstance.dislikesCount = dislikes;
            postInstance.usersEngagement.push(userLikeInfoToAdd)

            await postInstance.save();
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }


    async updateUserLikeInfo(postId: string, userLikeInfo: UserLikeInfo, likeStatus: LikeStatusesEnum,
                             likes: number, dislikes: number): Promise<boolean> {

        let userLikeInfoToAdd: UserLikeInfo = {
            userId: userLikeInfo.userId,
            createdAt: userLikeInfo.createdAt,
            userStatus: likeStatus
        }

        try {
            const postInstance = await PostModelClass.findOne({
                _id: postId,
                "usersEngagement.userId": userLikeInfo.userId
            })


            if (!postInstance) {
                return false
            }

            postInstance.usersEngagement.find(el => el.userId === userLikeInfoToAdd.userId)!.userStatus = likeStatus
            postInstance.likesCount = likes;
            postInstance.dislikesCount = dislikes;


            await postInstance.save();

            /*const postInstanceTEST = await PostModelClass.findOne({_id: postId})
             console.log(postInstanceTEST)*/

            return true

        } catch (error) {
            console.log(error)
            return false
        }
    }

}

//export const postsRepositories = new PostsDbRepository()

/*
export const postsRepositories = {

    async save(postInstance: HydratedDocument<PostDbType>): Promise<boolean> {
        try {
            await postInstance.save()
            return true
        } catch (error) {
            console.log(error)
            return false
        }

    },

    async updatePost(postId: string, title: string, shortDescription: string, content: string): Promise<string | null> {

        const postInstance = await PostModelClass.findOne({_id: postId})

        if (!postInstance) {
            return null
        }

        //postInstance.updatePost()

        postInstance.title = title;
        postInstance.shortDescription = shortDescription;
        postInstance.content = content;

        try {
            await postInstance.save()
            return postInstance._id.toString()
        } catch (error) {
            console.log(error)
            return null
        }

    },


    async deletePost(id: string): Promise<boolean> {
        const result = await PostModelClass.findOneAndDelete({_id: id})
        return result !== null

    },

    async deleteAllPosts(): Promise<number> {
        const result = await PostModelClass.deleteMany({})
        return result.deletedCount
    },


    async createUserLikeInfoInDb(postId: string, userLikeInfo: UserLikeInfo, likeStatus: LikeStatusesEnum, likes: number, dislikes: number): Promise<boolean> {

        let userLikeInfoToAdd: UserLikeInfo = {
            userId: userLikeInfo.userId,
            createdAt: userLikeInfo.createdAt,
            userStatus: likeStatus
        }

        if (likeStatus === LikeStatusesEnum.Like) {
            likes++
        }

        if (likeStatus === LikeStatusesEnum.Dislike) {
            dislikes++
        }

        try {
            const postInstance = await PostModelClass.findOne({_id: postId})

            if (!postInstance) {
                return false
            }

            postInstance.likesCount = likes;
            postInstance.dislikesCount = dislikes;
            postInstance.usersEngagement.push(userLikeInfoToAdd)

            await postInstance.save();
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    },

    async updateUserLikeInfo(postId: string, userLikeInfo: UserLikeInfo, likeStatus: LikeStatusesEnum,
                             likes: number, dislikes: number): Promise<boolean> {

        let userLikeInfoToAdd: UserLikeInfo = {
            userId: userLikeInfo.userId,
            createdAt: userLikeInfo.createdAt,
            userStatus: likeStatus
        }

        try {
            const postInstance = await PostModelClass.findOne({
                _id: postId,
                "usersEngagement.userId": userLikeInfo.userId
            })


            if (!postInstance) {
                return false
            }

            postInstance.usersEngagement.find(el => el.userId === userLikeInfoToAdd.userId)!.userStatus = likeStatus
            postInstance.likesCount = likes;
            postInstance.dislikesCount = dislikes;


            await postInstance.save();

            /!*const postInstanceTEST = await PostModelClass.findOne({_id: postId})
             console.log(postInstanceTEST)*!/

            return true

        } catch (error) {
            console.log(error)
            return false
        }
    }

}*/
