using Microsoft.EntityFrameworkCore;
using ProductManagement.Dtos.ApiDtos;
using ProductManagement.Enums;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using System.Threading.Tasks;

namespace ProductManagement.Extensions
{
    public static class QueryableExtension
    {
        private const string INCREASE_FIRST_SORTING = nameof(Queryable.OrderBy);
        private const string DECREASE_FIRST_SORTING = nameof(Queryable.OrderByDescending);

        private const string INCREASE_SORTING = nameof(Queryable.ThenBy);
        private const string DECREASE_SORTING = nameof(Queryable.ThenByDescending);

        public static IQueryable<T> ApplySortFields<T> (this IQueryable<T> queryable, params SortFieldDto[] properties)
        {
            // If don't sort by anything
            if(properties == null || !properties.Any())
            {
                return queryable;
            }

            // Sort by the first field
            var firstSorting = properties.First();
            var sorted = ApplySort(queryable, firstSorting, true);

            // Skip first field and sort for next
            foreach(var sortField in properties.Skip(1))
            {
                sorted = ApplySort(queryable, sortField, false);
            }

            return sorted;
        }

        public static IQueryable<T> ApplySort<T>(IQueryable<T> queryable, SortFieldDto sortField, bool isFirstSorting)
        {
            var sortMethod = isFirstSorting
                ? (sortField.Order == SortOrder.Asc ? INCREASE_FIRST_SORTING : DECREASE_FIRST_SORTING)
                : (sortField.Order == SortOrder.Asc ? INCREASE_SORTING : DECREASE_SORTING);

            // Generate a parameter argument of type Dto (specifically)
            var argumentExpression = Expression.Parameter(typeof(T), "src");

            // Sort by Name, Id or something, so this will be "Name", "Id" or something
            var property = typeof(T).GetProperty(sortField.Field);

            var propertyExpression = Expression.Property(argumentExpression, property);
            var lambdaExpression = Expression.Lambda(typeof(Func<,>).MakeGenericType(typeof(T), property.PropertyType),
                propertyExpression, argumentExpression);

            // In general, this block of code will look for the methods that has the name of OrderBy(Descending) or ThenBy(Descending)
            // Check if this method is a generic and has 2 parameters which is the second overload that accept an IComparer<TKey> comparer
            // And invoke it
            var result = typeof(Queryable).GetMethods().Single(
                method => method.Name == sortMethod &&
                          method.IsGenericMethodDefinition &&
                          method.GetGenericArguments().Length == 2 &&
                          method.GetParameters().Length == 2)
                .MakeGenericMethod(typeof(T), property.PropertyType)
                .Invoke(null, new object[] { queryable, lambdaExpression });

            return (IOrderedQueryable<T>)result;
        }

        public static async Task<DataSourceResultDto<TEntity>> ApplyPaging<TEntity>(
            this IQueryable<TEntity> query,
            DataSourceRequestDto request)
        {
            var sortedQuery = query.ApplySortFields(request.Sorts.ToArray());
            var result = new DataSourceResultDto<TEntity>();
            result.Total = await sortedQuery.CountAsync();
            result.Data = await sortedQuery.Skip(request.Skip).Take(request.Take).ToListAsync();
            return result;
        }
    }
}
