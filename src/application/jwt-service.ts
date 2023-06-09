import jwt from 'jsonwebtoken'
import {TokenDBType} from "../repositories/db/types";
import {settings} from "../settings";
import {tokenRepositories} from "../repositories/token-db-repositories";
import { v4 as uuidv4 } from 'uuid';


export const jwtService = {
    async createJwtToken(id: string) {

        const accessToken = jwt.sign({userId: id}, settings.JWT_SECRET, {expiresIn: '10m'})
        const refreshToken = jwt.sign({userId: id, deviceId: uuidv4()}, settings.JWT_SECRET, {expiresIn: '20m'})

        const decodedRefreshToken = jwt.decode(refreshToken)

        return {
            accessToken: accessToken,
            refreshToken: refreshToken,
            decodedRefreshToken: decodedRefreshToken
        }
    },

    async getUserIdByToken(tokenFromHead: string) {

        try {
            const result: any = jwt.verify(tokenFromHead, settings.JWT_SECRET) // если verify не сработает, упадет ошибка

            return result.userId

        } catch (error) {
            return null
        }
    },

    async checkRefreshTokenIsValid(refreshToken: string) {

        try {
            const verifyRefTok: any = jwt.verify(refreshToken, settings.JWT_SECRET)
            return verifyRefTok

        } catch (error) {
            console.log(error)
            return null
        }

    },

    async getRefreshTokenFromDb(refreshToken: string): Promise<TokenDBType | null> {

        const decodedRefreshToken = jwt.decode(refreshToken)

        const foundRefreshTokenInDb = await tokenRepositories.findToken(decodedRefreshToken)

        if (!foundRefreshTokenInDb) {
            return null
        } else {
            return foundRefreshTokenInDb
        }
    },

    async createNewRefreshToken (userId: string, deviceId: string) {

        const newAccessToken = jwt.sign({userId: userId}, settings.JWT_SECRET, {expiresIn: '10s'})
        const newRefreshToken = jwt.sign({userId: userId,
            deviceId: deviceId}, settings.JWT_SECRET, {expiresIn: '20s'})
        const newDecodedRefreshToken = jwt.decode(newRefreshToken)

        return {
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
            decodedRefreshToken: newDecodedRefreshToken
        }
    },


}

