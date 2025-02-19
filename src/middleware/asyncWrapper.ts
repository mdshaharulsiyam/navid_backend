import { Request, Response, NextFunction } from "express";
import globalErrorHandler from "../utils/globalErrorHandler";

const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next,).catch((error) => {
            globalErrorHandler(error, req, res, next);
        });
    };
};

export default asyncWrapper;