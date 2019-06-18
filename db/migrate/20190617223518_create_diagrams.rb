class CreateDiagrams < ActiveRecord::Migration[5.2]
  def change
    create_table :diagrams do |t|
      t.uuid :guid
      t.json :data

      t.timestamps
    end
    add_index :diagrams, :guid
  end
end
