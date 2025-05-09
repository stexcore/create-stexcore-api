import { Model, ModelStatic, Sequelize } from "sequelize";

export type ModelConstructor<
    TModelAttributes extends {} = any, 
    TCreationAttributes extends {} = TModelAttributes
> = {
    (sequelize: Sequelize): ModelStatic<Model<TModelAttributes, TCreationAttributes> & TModelAttributes>
}