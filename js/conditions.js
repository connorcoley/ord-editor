/**
 * Copyright 2020 Open Reaction Database Project Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

goog.module('ord.conditions');
goog.module.declareLegacyNamespace();
exports = {
  load,
  unload,
  validateConditions
};

const asserts = goog.require('goog.asserts');

const electro = goog.require('ord.electro');
const flows = goog.require('ord.flows');
const illumination = goog.require('ord.illumination');
const pressure = goog.require('ord.pressure');
const stirring = goog.require('ord.stirring');
const temperature = goog.require('ord.temperature');
const utils = goog.require('ord.utils');

const ReactionConditions = goog.require('proto.ord.ReactionConditions');

/**
 * Adds and populates the reaction conditions in the form.
 * @param {!ReactionConditions} conditions
 */
function load(conditions) {
  const temperatureMessage = conditions.getTemperature();
  if (temperatureMessage) {
    temperature.load(temperatureMessage);
  }
  const pressureMessage = conditions.getPressure();
  if (pressureMessage) {
    pressure.load(pressureMessage);
  }
  const stirringMessage = conditions.getStirring();
  if (stirringMessage) {
    stirring.load(stirringMessage);
  }
  const illuminationMessage = conditions.getIllumination();
  if (illuminationMessage) {
    illumination.load(illuminationMessage);
  }
  const electroMessage = conditions.getElectrochemistry();
  if (electroMessage) {
    electro.load(electroMessage);
  }
  const flowMessage = conditions.getFlow();
  if (flowMessage) {
    flows.load(flowMessage);
  }
  const reflux = conditions.hasReflux() ? conditions.getReflux() : null;
  utils.setOptionalBool($('#condition_reflux'), reflux);
  if (conditions.hasPh()) {
    $('#condition_ph').text(conditions.getPh());
  }
  const dynamic = conditions.hasConditionsAreDynamic() ?
      conditions.getConditionsAreDynamic() :
      null;
  utils.setOptionalBool($('#condition_dynamic'), dynamic);
  $('#condition_details').text(conditions.getDetails());
}

/**
 * Fetches the reaction conditions from the form.
 * @return {!ReactionConditions}
 */
function unload() {
  const conditions = new ReactionConditions();
  const temperatureMessage = temperature.unload();
  if (!utils.isEmptyMessage(temperatureMessage)) {
    conditions.setTemperature(temperatureMessage);
  }
  const pressureMessage = pressure.unload();
  if (!utils.isEmptyMessage(pressureMessage)) {
    conditions.setPressure(pressureMessage);
  }
  const stirringMessage = stirring.unload();
  if (!utils.isEmptyMessage(stirringMessage)) {
    conditions.setStirring(stirringMessage);
  }
  const illuminationMessage = illumination.unload();
  if (!utils.isEmptyMessage(illuminationMessage)) {
    conditions.setIllumination(illuminationMessage);
  }
  const electroMessage = electro.unload();
  if (!utils.isEmptyMessage(electroMessage)) {
    conditions.setElectrochemistry(electroMessage);
  }
  const flowMessage = flows.unload();
  if (!utils.isEmptyMessage(flowMessage)) {
    conditions.setFlow(flowMessage);
  }

  const reflux = utils.getOptionalBool($('#condition_reflux'));
  if (reflux !== null) {
    conditions.setReflux(reflux);
  }
  const ph = parseFloat($('#condition_ph').text());
  if (!isNaN(ph)) {
    conditions.setPh(ph);
  }
  const dynamic = utils.getOptionalBool($('#condition_dynamic'));
  if (dynamic !== null) {
    conditions.setConditionsAreDynamic(dynamic);
  }
  const details = $('#condition_details').text();
  conditions.setDetails(asserts.assertString(details));
  return conditions;
}

/**
 * Validates the reaction conditions defined in the form.
 * @param {!jQuery} node Root node for the reaction conditions.
 * @param {?jQuery=} validateNode Target node for validation results.
 */
function validateConditions(node, validateNode = null) {
  const condition = unload();
  utils.validate(condition, 'ReactionConditions', node, validateNode);
}
