/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

import { AdapterUtils } from '../../support/utils/AdapterUtils';
import { GenericAdapterBuilder } from '../../support/builder/GenericAdapterBuilder';

describe('Test File Stream Adapter', () => {
  before('Setup Test', () => {
    // cy.initStreamPipesTest();
    cy.login();
  });

  it('Perform Test', () => {

    const adapterInput = GenericAdapterBuilder
      .create('Apache_Kafka')
      .setName('Kafka4')
      .setTimestampProperty('timestamp')
      .addProtocolInput('select', 'Unauthenticated', 'check')
      .addProtocolInput('input', 'host', 'localhost')
      .addProtocolInput('input', 'port', '9094')
      .addProtocolInput('click', 'sp-reload', '')
      .addProtocolInput('select', 'adapterstatus', 'check')
      .setFormat('json_object')
      .build();

    AdapterUtils.testGenericStreamAdapter(adapterInput);
  });

});

