/*
 * ProcessExplorer
 * Copyright (C) 2020  Alexander Seeliger
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

package org.processexplorer.server.common.persistence.repository;

import org.processexplorer.server.common.persistence.entity.EventLogModel;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * @author Alexander Seeliger on 10.08.2020.
 */
@Repository
public interface EventLogModelRepository extends CrudRepository<EventLogModel, Long> {

    List<EventLogModel> findByEventLogLogName(String logName);

    EventLogModel findFirstByEventLogLogNameAndUse(String logName, boolean use);

    void deleteAllByEventLogLogName(String logName);

}
