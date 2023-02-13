using Microsoft.AspNetCore.Http;
using Newtonsoft.Json;
using ProductManagement.Exceptions;
using ProductManagement.Exceptions.BrandExceptions;
using ProductManagement.Exceptions.CategoryExceptions;
using ProductManagement.Exceptions.GeneralExceptions;
using ProductManagement.Exceptions.ProductExceptions;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace ProductManagement.Middleware
{
    public class ExceptionHandlingMiddleware
    {
        public RequestDelegate _requestDelegate;
        public ExceptionHandlingMiddleware(RequestDelegate requestDelegate)
        {
            _requestDelegate = requestDelegate;
        }
        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _requestDelegate(context);
            }
            catch(Exception e)
            {
                await HandleException(context, e);
            }
        }

        private static Task HandleException(HttpContext context, Exception e)
        {
            var errorMessageObject = new Error(e.Message, "BASE");
            var statusCode = (int)HttpStatusCode.InternalServerError;
            switch (e)
            {
                case ProductIdInvalidException:
                    errorMessageObject.Code = "PE01_INVALID";
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case ProductInformationInvalidException:
                    errorMessageObject.Code = "PE02_INFORMATION_INVALID";
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case ProductNotFoundException:
                    errorMessageObject.Code = "PE03_NOT_FOUND";
                    statusCode = (int)HttpStatusCode.NotFound;
                    break;
                case ProductRatingInvalidException:
                    errorMessageObject.Code = "PE04_RATING_INVALID";
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case BrandIdInvalidException:
                    errorMessageObject.Code = "BE01_INVALID";
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case CategoryIdInvalidException:
                    errorMessageObject.Code = "CE01_INVALID";
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;
                case EmptyStringException:
                    errorMessageObject.Code = "GE01_EMPTY_STRING";
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;
            }

            var errorMessage = JsonConvert.SerializeObject(errorMessageObject);
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = statusCode;

            return context.Response.WriteAsync(errorMessage);
        }
    }
}
