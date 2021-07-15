import { IResolvers } from 'apollo-server-express'

export const Rcontent:IResolvers = {
    Query:{
        helloc() {
            return "mundo"
        },
    }
}