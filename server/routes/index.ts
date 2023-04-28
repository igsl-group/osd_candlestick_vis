/*
 * Copyright OpenSearch Contributors
 * SPDX-License-Identifier: Apache-2.0
 */
import { RequestParams } from '@elastic/elasticsearch';
import { schema } from '@osd/config-schema';
import { IRouter } from '../../../../src/core/server';

export function defineRoutes(router: IRouter) {
  router.post(
    {
      path: '/api/candlestick_chart_vis/query',
      validate: {
        body: schema.object({
          index: schema.string(),
          size: schema.number(),
          body: schema.object({
            query: schema.maybe(
              schema.object({
                bool: schema.object({
                  filter: schema.maybe(schema.arrayOf(schema.object({}, { unknowns: 'allow' }))),
                  must: schema.maybe(schema.arrayOf(schema.object({}, { unknowns: 'allow' }))),
                  should: schema.maybe(schema.arrayOf(schema.object({}, { unknowns: 'allow' }))),
                  must_not: schema.maybe(schema.arrayOf(schema.object({}, { unknowns: 'allow' }))),
                }),
              })
            ),
            sort: schema.maybe(schema.arrayOf(schema.any())),
            aggs: schema.maybe(schema.any())
          }),
        }),
      }
    },
    async (context, request, response) => {
      const { index, size, ...rest } = request.body;
      const params: RequestParams.Search = {
        index,
        size,
        ...rest,
      };
      try {
        const resp = await context.core.opensearch.legacy.client.callAsCurrentUser(
          'search',
          params
        );
        return response.ok({
          body: {
            aggregations: resp.aggregations
          },
        });
      } catch (error: any) {
        console.error(error);

        return response.custom({
          statusCode: error.statusCode || 500,
          body: error.message,
        });
      }
    }
  );
}
