exports.up = function(knex) {
  return knex.schema
    .createTable('games', function(table) {
      table.uuid('id').primary();
      table.string('status').notNullable().defaultTo('waiting');
      table.timestamps(true, true);
    })
    .createTable('players', function(table) {
      table.uuid('id').primary();
      table.uuid('game_id').references('id').inTable('games');
      table.string('username').notNullable();
      table.integer('score').defaultTo(0);
      table.boolean('is_card_czar').defaultTo(false);
      table.timestamps(true, true);
    })
    .createTable('cards', function(table) {
      table.uuid('id').primary();
      table.text('content').notNullable();
      table.string('type').notNullable().checkIn(['black', 'white']);
      table.integer('pick').defaultTo(1);
      table.timestamps(true, true);
    })
    .createTable('game_cards', function(table) {
      table.uuid('id').primary();
      table.uuid('game_id').references('id').inTable('games');
      table.uuid('player_id').references('id').inTable('players');
      table.uuid('card_id').references('id').inTable('cards');
      table.string('status').defaultTo('in_deck');
      table.timestamps(true, true);
    })
    .createTable('messages', function(table) {
      table.uuid('id').primary();
      table.uuid('game_id').references('id').inTable('games');
      table.uuid('player_id').references('id').inTable('players');
      table.text('content').notNullable();
      table.timestamps(true, true);
    });
};

exports.down = function(knex) {
  return knex.schema
    .dropTable('messages')
    .dropTable('game_cards')
    .dropTable('cards')
    .dropTable('players')
    .dropTable('games');
}; 